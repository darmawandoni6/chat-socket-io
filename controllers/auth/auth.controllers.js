const createError = require("http-errors");
const response = require("../../helpers/response");
const { encrypt, compare } = require("../../middlewares/bcrypt");
const { signToken } = require("../../middlewares/jwt");
const usersService = require("../../services/users.service");
const { generateString } = require("../../helpers/randomString");
const { sendEmail } = require("../../helpers/sendEmail");
const path = require("path");

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
      const exp = parseInt(process.env.EXP_TOKEN, 10);
      date.setDate(date.getDate() + exp);

      res.status = 200;
      res.cookie("token", token, { expires: date, httpOnly: true });

      res.send({
        token,
        expiredDate: date,
      });
    } catch (error) {
      next(error);
    }
  },
  forgotPassword: async (req, res, next) => {
    try {
      const { email } = req.body;

      let result = { data: null, error: null };
      result = await usersService.findOne({ email });
      if (!result.data) throw createError.NotFound();
      if (result.error) throw createError.BadRequest(result.error);

      const password = generateString(12);

      const payload = {
        password: encrypt(password),
      };

      result = await usersService.update(payload, { id: result.data.id });
      if (result.error) throw createError.BadRequest(result.error);

      await sendEmail(
        path.join(__dirname, "../../templates/forgot_password.ejs"),
        {
          receiver: email,
          subject: "test email",
          content: {
            password,
            link: "#",
          },
        }
      );

      response({
        res,
        status: 200,
        message: "Please check your email!",
      });
    } catch (error) {
      next(error);
    }
  },
  logOut: async (req, res, next) => {
    try {
      res.clearCookie("token");
      response({
        res,
        status: 200,
        message: "Logout berhasil",
      });
    } catch (error) {
      next(error);
    }
  },
};
