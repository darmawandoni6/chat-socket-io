const createError = require("http-errors");
const { Op } = require("sequelize");
const response = require("../helpers/response");
const roomsService = require("../services/rooms.service");
const rooms_usersService = require("../services/rooms_users.service");
const messageService = require("../services/message.service");

module.exports = {
  createRoom: async (req, res, next) => {
    try {
      const { name, id, grubId } = req.body;
      const { id: userId } = req.payload;

      const payload = {
        name,
        type: "private",
      };
      let payloadUsers = [id, userId];

      if (grubId) {
        payload.type = "grub";
        payloadUsers = [...grubId, userId];
      }
      let result = { data: null, error: null };

      if (payload.type === "private") {
        result = await roomsService.findOne({ name });
        if (result.data) {
          result = await messageService.findAll({ roomId: result.data.id });
          response({
            res,
            status: 200,
            message: "open room",
            data: result.data,
          });
          return;
        }
        if (result.error) {
          throw createError.BadRequest(result.error);
        }
      }
      result = await roomsService.addRoom(payload, payloadUsers, userId);
      if (result.error) throw createError.BadRequest(result.error);

      result = await messageService.findAll({ roomId: result.data.id });
      response({
        res,
        status: 200,
        message: "success create room",
        data: result.data,
      });
    } catch (error) {
      next(error);
    }
  },
  listRoom: async (req, res, next) => {
    try {
      const { id } = req.payload;
      const { data, error } = await roomsService.listRoom({ id });
      if (error) throw createError.BadRequest(error);

      response({ res, status: 200, message: "success", data });
    } catch (error) {
      next(error);
    }
  },
  openRoom: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { data, error } = await roomsService.openRoom({ id });
      if (!data) throw createError.NotFound();
      if (error) throw createError.BadRequest(error);
      response({ res, status: 200, message: "success", data });
    } catch (error) {
      next(error);
    }
  },
  inviteGrub: async (req, res, next) => {
    try {
      const { roomId } = req.params;
      const { users } = req.body;
      const { id } = req.payload;

      let result = { data: null, error: null };

      result = await rooms_usersService.findOne({
        roomId,
        userId: id,
      });

      if (!result.data) throw createError.NotFound();
      if (result.data.role !== "admin")
        throw createError.BadRequest("Invite user only admin");
      if (result.error) throw createError.BadRequest(result.error);

      result = await rooms_usersService.findOne({
        roomId,
        userId: users,
      });
      if (result.data) throw createError.Conflict();
      if (result.error) throw createError.BadRequest(result.error);

      const payload = users.map((item) => ({
        roomId,
        userId: item,
        role: "user",
      }));
      result = await rooms_usersService.bulkCreate(payload);
      if (result.error) throw createError.BadRequest(result.error);

      response({ res, status: 200, message: "success invite grub" });
    } catch (error) {
      next(error);
    }
  },
  editRoom: async (req, res, next) => {
    try {
      const { name } = req.body;
      const { id } = req.params;
      const { id: userId } = req.payload;

      let result = { data: null, error: null };

      result = await rooms_usersService.findOne({
        roomId: id,
        userId,
      });

      if (!result.data) throw createError.NotFound();
      if (result.data.role !== "admin")
        throw createError.BadRequest("change name only admin");
      if (result.error) throw createError.BadRequest(result.error);

      const payload = {
        name,
        updatedAt: new Date(),
      };
      result = await roomsService.update({ id }, payload);
      if (result.error) throw createError.BadRequest(result.error);

      response({
        res,
        status: 200,
        message: "Success change name",
        data: result.data,
      });
    } catch (error) {
      next(error);
    }
  },
  removeUser: async (req, res, next) => {
    try {
      const { users } = req.body;
      const { id } = req.params;
      const { id: userId } = req.payload;

      let result = { data: null, error: null };

      result = await rooms_usersService.findOne({
        roomId: id,
        userId,
      });

      if (!result.data) throw createError.NotFound();
      if (result.data.role !== "admin")
        throw createError.BadRequest("change name only admin");
      if (result.error) throw createError.BadRequest(result.error);

      result = await rooms_usersService.remove({
        roomId: id,
        userId: users,
      });

      if (result.error) throw createError.BadRequest(result.error);

      response({
        res,
        status: 200,
        message: "Success remove user in grub",
      });
    } catch (error) {
      next(error);
    }
  },
  leaveGrub: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { id: userId } = req.payload;

      let result = { data: null, error: null };
      let newAdmin = false;

      result = await rooms_usersService.findOne({
        roomId: id,
        userId,
      });

      if (!result.data) throw createError.NotFound();
      if (result.data.role === "admin") {
        newAdmin = true;
      }
      if (result.error) throw createError.BadRequest(result.error);

      if (newAdmin) {
        result = await rooms_usersService.findAll({
          roomId: id,
          userId: {
            [Op.ne]: userId,
          },
        });
        if (result.error) throw createError.BadRequest(result.error);
      }
      result = await rooms_usersService.remove(
        {
          roomId: id,
          userId,
        },
        result.data[0]
      );
      if (result.error) throw createError.BadRequest(result.error);

      response({
        res,
        status: 200,
        message: "Success leave in grub",
      });
    } catch (error) {
      next(error);
    }
  },
  removeRoom: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { id: userId } = req.payload;

      let result = { data: null, error: null };

      result = await rooms_usersService.findOne({
        roomId: id,
        userId,
      });

      if (!result.data) throw createError.NotFound();
      if (result.data.role !== "admin") {
        throw createError.BadRequest("remove room only admin");
      }
      if (result.error) throw createError.BadRequest(result.error);

      result = await rooms_usersService.findAll({
        roomId: id,
      });
      if (result.error) throw createError.BadRequest(result.error);

      const users = result.data.map((item) => item.id);
      result = await roomsService.remove({ id }, { id: users });
      if (result.error) throw createError.BadRequest(result.error);

      response({
        res,
        status: 200,
        message: "Success remove grub",
      });
    } catch (error) {
      next(error);
    }
  },
};
