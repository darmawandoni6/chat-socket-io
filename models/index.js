const db = require("../configs/config.db");
const Users = require("./users.model");
const Rooms = require("./rooms.model");
const Messages = require("./messages.model");
const Contacts = require("./contacts.model");
const Rooms_users = require("./rooms_users.model");

(async () => {
  try {
    await db.authenticate();
    console.log("Database Connected ....");
    console.log("alter table ----------------------------------------");
    // await Contacts.sync({ alter: true });
    await Rooms.sync({ alter: true });
    await Users.sync({ alter: true });
    await Rooms_users.sync({ alter: true });
    // await Messages.sync({ alter: true });
    // await ListRooms.sync({ alter: true });

    console.log("alter table done ----------------------------------------");
  } catch (error) {
    console.error(error.message);
    console.log();
    console.log(" ---------------------------");
    process.exit();
  }
})();
