import { Request as ExpressRequest, Response } from 'express';
import { sequelize } from '../config/database';
import models from '../models';
import type { TitleStatusInstance } from '../models/titleStatus';
import {
  TITLE_STATUS_IN_PROCESS_ID,
  TITLE_STATUS_PENDING_REQUEST_ID,
  REQUEST_STATUS_PENDING_NAME,
  REQUIREMENT_STATUS_INITIAL_ID
} from '../constants/status';
import { evaluateRequestStatus } from '../services/requestRequirementService';

type CreateRequestPayload = {
  idUser?: number | string;
  idTitle?: number | string;
  idRequestType?: number | string;
};

const createRequest = async (req: ExpressRequest, res: Response): Promise<void> => {
  const transaction = await sequelize.transaction();

  try {
    const { idUser, idTitle, idRequestType } = req.body as CreateRequestPayload;

    const parsedIdUser = Number(idUser);
    const parsedIdTitle = Number(idTitle);
    const parsedIdRequestType = Number(idRequestType);

    const isValidInteger = (value: number): boolean => Number.isInteger(value) && value > 0;

    if (!isValidInteger(parsedIdTitle) || !isValidInteger(parsedIdRequestType) || !isValidInteger(parsedIdUser)) {
      await transaction.rollback();
      res.status(400).json({ message: 'idTitle, idRequestType y idUser son obligatorios' });
      return;
    }

    const title = await models.title.findByPk(parsedIdTitle, {
      transaction,
      include: [
        { model: models.titleStatus, as: 'titleStatus' },
        { model: models.requestType, as: 'requestType' }
      ]
    });

    if (!title) {
      await transaction.rollback();
      res.status(404).json({ message: 'El título especificado no existe' });
      return;
    }

    const titleStatusInstance = title.get('titleStatus') as TitleStatusInstance | null;
    if (
      titleStatusInstance &&
      titleStatusInstance.getDataValue('idTitleStatus') !== TITLE_STATUS_PENDING_REQUEST_ID
    ) {
      await transaction.rollback();
      res.status(409).json({ message: 'El título seleccionado no está disponible para solicitar' });
      return;
    }

    const requestType = await models.requestType.findByPk(parsedIdRequestType, { transaction });

    if (!requestType) {
      await transaction.rollback();
      res.status(404).json({ message: 'El tipo de solicitud especificado no existe' });
      return;
    }

    const titleAssignedRequestTypeId = title.getDataValue('requestTypeId');
    if (titleAssignedRequestTypeId && titleAssignedRequestTypeId !== parsedIdRequestType) {
      await transaction.rollback();
      res.status(400).json({ message: 'El título seleccionado no corresponde al tipo de solicitud indicado' });
      return;
    }

    const existingRequest = await models.request.findOne({
      where: {
        userId: parsedIdUser,
        titleId: parsedIdTitle
      },
      transaction
    });

    if (existingRequest) {
      await transaction.rollback();
      res.status(409).json({ message: 'Ya existe una solicitud para este título y usuario' });
      return;
    }

    const requestStatus = await models.requestStatus.findOne({
      where: {
        requestStatusName: REQUEST_STATUS_PENDING_NAME
      },
      transaction
    });

    if (!requestStatus) {
      await transaction.rollback();
      res.status(500).json({ message: 'No se encontró el estado inicial de la solicitud' });
      return;
    }

    const generatedAt = new Date().toISOString().split('T')[0];

    const createdRequest = await models.request.create(
      {
        userId: parsedIdUser,
        requestTypeId: parsedIdRequestType,
        titleId: parsedIdTitle,
        generatedAt
      },
      { transaction }
    );

    const requestRequirements = await models.requestTypeRequirement.findAll({
      where: {
        requestTypeId: parsedIdRequestType,
        isRequired: 1
      },
      transaction
    });

    if (requestRequirements.length > 0) {
      await models.requestRequirementInstance.bulkCreate(
        requestRequirements.map((requirement) => ({
          requestId: createdRequest.getDataValue('idRequest'),
          requirementId: requirement.getDataValue('requirementId'),
          currentRequirementStatusId: REQUIREMENT_STATUS_INITIAL_ID,
          completionVersion: 1
        })),
        { transaction }
      );
    }

    await models.requestStatusHistory.create(
      {
        requestId: createdRequest.getDataValue('idRequest'),
        requestStatusId: requestStatus.getDataValue('idRequestStatus'),
        statusStartDate: generatedAt,
        statusEndDate: null
      },
      { transaction }
    );

    await models.title.update(
      { titleStatusId: TITLE_STATUS_IN_PROCESS_ID },
      {
        where: { idTitle: parsedIdTitle },
        transaction
      }
    );

    await transaction.commit();

    res.status(201).json({
      data: {
        idRequest: createdRequest.getDataValue('idRequest'),
        generatedAt,
        currentStatus: requestStatus.getDataValue('requestStatusName'),
        requestType: {
          idRequestType: requestType.getDataValue('idRequestType'),
          requestTypeName: requestType.getDataValue('requestTypeName')
        },
        title: {
          idTitle: title.getDataValue('idTitle'),
          titleName: title.getDataValue('titleName')
        },
        requirements: requestRequirements.map((requirement) => ({
          requirementId: requirement.getDataValue('requirementId'),
          isRequired: requirement.getDataValue('isRequired') === 1
        }))
      }
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: 'Error al generar la solicitud de título', error });
  }
};

const getRequestEvaluation = async (req: ExpressRequest, res: Response): Promise<void> => {
  try {
    const requestId = Number(req.params.requestId);

    if (!Number.isInteger(requestId) || requestId <= 0) {
      res.status(400).json({ message: 'requestId debe ser un número positivo' });
      return;
    }

    const evaluation = await evaluateRequestStatus(requestId);

    res.status(200).json({ data: evaluation });
  } catch (error) {
    res.status(500).json({ message: 'Error al evaluar el estado de la solicitud', error });
  }
};

export { createRequest, getRequestEvaluation };
