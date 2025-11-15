import { Request as ExpressRequest, Response } from 'express';
import { Op } from 'sequelize';
import { sequelize } from '../config/database';
import models from '../models';
import {
  TITLE_STATUS_IN_PROCESS_ID,
  TITLE_STATUS_PENDING_REQUEST_NAME,
  REQUIREMENT_STATUS_INITIAL_NAME
} from '../constants/status';

const createRequest = async (req: ExpressRequest, res: Response): Promise<void> => {
  const transaction = await sequelize.transaction();

  try {
    const { idUser, idTitle, idRequestType } = req.body;

    if (!idTitle || !idRequestType || !idUser) {
      await transaction.rollback();
      res.status(400).json({ message: 'idTitle, idRequestType y idUser son obligatorios' });
      return;
    }

    const title = await models.title.findByPk(idTitle, { transaction });

    if (!title) {
      await transaction.rollback();
      res.status(404).json({ message: 'El título especificado no existe' });
      return;
    }

    const requestType = await models.requestType.findByPk(idRequestType, { transaction });

    if (!requestType) {
      await transaction.rollback();
      res.status(404).json({ message: 'El tipo de solicitud especificado no existe' });
      return;
    }

    const requestStatus = await models.requestStatus.findOne({
      where: {
        requestStatusName: TITLE_STATUS_PENDING_REQUEST_NAME
      },
      transaction
    });

    if (!requestStatus) {
      await transaction.rollback();
      res.status(500).json({ message: 'No se encontró el estado inicial de la solicitud' });
      return;
    }

    const requirementInstanceStatus = await models.requirementInstanceStatus.findOne({
      where: {
        requirementInstanceStatusName: REQUIREMENT_STATUS_INITIAL_NAME
      },
      transaction
    });

    if (!requirementInstanceStatus) {
      await transaction.rollback();
      res
        .status(500)
        .json({ message: 'No se encontró el estado inicial para los requisitos' });
      return;
    }

    const generatedAt = new Date().toISOString().split('T')[0];

    const createdRequest = await models.request.create(
      {
        userId: idUser,
        requestTypeId: idRequestType,
        generatedAt
      },
      { transaction }
    );

    const requestRequirements = await models.requestTypeRequirement.findAll({
      where: {
        requestTypeId: idRequestType,
        isRequired: 1
      },
      transaction
    });

    if (requestRequirements.length > 0) {
      await models.requestRequirementInstance.bulkCreate(
        requestRequirements.map((requirement) => ({
          requestId: createdRequest.getDataValue('idRequest'),
          requirementId: requirement.getDataValue('requirementId'),
          currentRequirementStatusId: requirementInstanceStatus.getDataValue(
            'idRequirementInstanceStatus'
          ),
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
        where: { idTitle },
        transaction
      }
    );

    await transaction.commit();

    res.status(201).json({
      idRequest: createdRequest.getDataValue('idRequest'),
      generatedAt,
      currentStatus: requestStatus.getDataValue('requestStatusName'),
      requirements: requestRequirements.map((requirement) => ({
        requirementId: requirement.getDataValue('requirementId')
      }))
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: 'Error al generar la solicitud de título', error });
  }
};

export { createRequest };
