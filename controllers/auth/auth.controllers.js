const createError = require("http-errors");
const response = require("../../helpers/response");
const { encrypt, compare } = require("../../middlewares/bcrypt");
const { signToken } = require("../../middlewares/jwt");
const usersService = require("../../services/users.service");

module.exports = {
  auth: async (req, res, next) => {
    try {
      if (!req.payload) {
        throw createError.Unauthorized();
      }
      response({
        res,
        status: 200,
        message: "Register success",
        data: req.payload,
      });
    } catch (error) {
      next(error);
    }
  },
  register: async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const validate = { name, email, password };
      Object.entries(validate).forEach((item) => {
        if (!item[1]) throw createError.BadRequest(`${item[0]} is required`);
      });
      const { data, error: errFind } = await usersService.findOne({ email });
      if (data) throw createError.Conflict(`${email} sudah terdaftar`);
      if (errFind) throw createError.BadRequest(errFind);

      const payload = {
        ...req.body,
        password: encrypt(password),
      };
      let { error: errCreate } = await usersService.create(payload);
      if (errCreate) throw createError.BadRequest(errCreate);

      response({ res, status: 200, message: "Register success" });
    } catch (error) {
      next(error);
    }
  },
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const validate = { email, password };
      Object.entries(validate).forEach((item) => {
        if (!item[1]) throw createError.BadRequest(`${item[0]} is required`);
      });

      let { data, error } = await usersService.findOne({ email });
      if (!data) throw createError.NotFound(`${email} tidak ditemukan`);
      if (error) throw createError.BadRequest(error);

      const match = compare(password, data.password);
      if (!match) throw createError.NotFound(`${email} tidak ditemukan`);

      data = data.toJSON();
      delete data.password;
      const token = signToken(data);

      const date = new Date();
      const time = parseInt(process.env.EXP_TOKEN, 10);
      date.setMilliseconds(time);

      res.status = 200;
      // res.cookie("token", token, { maxAge: time, httpOnly: true });
      res.cookie("token", token);

      res.send({
        token,
        expiredDate: date,
      });
    } catch (error) {
      next(error);
    }
  },
};
