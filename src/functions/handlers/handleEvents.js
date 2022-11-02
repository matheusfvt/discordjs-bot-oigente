const fs = require("fs");

module.exports = (client) => {
  client.handleEvents = () => {
    const eventFolders = fs.readdirSync("./src/events");

    for (const folder of eventFolders) {
      const eventFiles = fs
        .readdirSync(`./src/events/${folder}`)
        .filter((file) => file.endsWith(".js"));

      const { events } = client;

      for (const file of eventFiles) {
        const event = require(`../../events/${folder}/${file}`);

        const execute = (...args) => event.execute(...args, client);
        events.set(event.name, execute);

        if (event.rest) {
          if (event.once) client.rest.once(event.name, execute);
          else client.rest.on(event.name, execute);
        } else {
          if (event.once) client.once(event.name, execute);
          else client.on(event.name, execute);
        }

        return console.log("✅ Loaded Events");
      }
    }
  };
};
