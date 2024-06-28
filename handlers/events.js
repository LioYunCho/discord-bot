
const { readdirSync } = require("fs");
module.exports = async (client) => {
  try {
    readdirSync("./events/").forEach((file) => {
      const events = readdirSync("./events/").filter((file) =>
        file.endsWith(".js")
      );

      for (let file of events) {
        let pull = require(`../events/${file}`);

        if (pull.name) {
          client.events.set(pull.name, pull);
        }
      }
    });
    console.log('--------------------------')
    console.log('Developer by Near Hoshinova')
    console.log('Discord Account: XiaoXiao#5925')
    console.log('--------------------------')
    console.log('Events loaded Succesfully.')
  } catch (e) {
    console.log(String(e.stack).bgRed)
  }
};