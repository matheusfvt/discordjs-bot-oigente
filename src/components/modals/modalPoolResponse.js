const { EmbedBuilder } = require("discord.js");
const { capitalize } = require("../../helpers/capitalize");

module.exports = {
  data: {
    name: "modalPool",
  },
  async execute(interaction) {
    var filter = () => {};
    const optionsPoolArray = [];
    const emojiCharacters = { 1: "1️⃣", 2: "2️⃣", 3: "3️⃣", 4: "4️⃣" };
    const fieldsObject = interaction.fields.fields;
    const poolFieldsSize = fieldsObject.size;

    const embedPool = new EmbedBuilder()
      .addFields({
        name: "Pergunta",
        value: `${capitalize(interaction.fields.getTextInputValue("modalTitlePool"))}`,
      })
      .setColor(0xffa500);

    if (poolFieldsSize > 1) {
      for (var i = 0; i < poolFieldsSize - 1; i++) {
        optionsPoolArray[i] = interaction.fields.getTextInputValue(`option${i}`);
      }
      const fieldsArray = optionsPoolArray.map(
        (option, index) => `${emojiCharacters[1 + index]} ${capitalize(option)}\n`
      );
      console.log(fieldsArray);
      embedPool.addFields({
        name: "Opções",
        value: fieldsArray.join(" "),
      });

      filter = (reaction, user) =>
        Object.values(emojiCharacters).includes(reaction.emoji.name) && !user.bot;
    } else {
      filter = (reaction, user) => ["👍", "👎"].includes(reaction.emoji.name) && !user.bot;
    }

    const message = await interaction.reply({
      embeds: [embedPool],
      fetchReply: true,
    });

    const collector = message.createReactionCollector({
      filter,
      maxEmojis: optionsPoolArray.lenght === 0 ? 2 : optionsPoolArray.length,
    });

    collector.on("collect", (reaction, user) => {
      reaction.message.reactions.cache.map((x) => {
        if (x._emoji.name != reaction._emoji.name && x.users.cache.has(user.id))
          x.users.remove(user.id);
      });
    });

    if (optionsPoolArray.length === 0) {
      message
        .react("👍")
        .then(() => message.react("👎"))
        .catch((error) => console.error("One of the emojis failed to react:", error));
    } else if (optionsPoolArray.length === 2) {
      message.react(emojiCharacters[1]).then(() => message.react(emojiCharacters[2]));
    } else if (optionsPoolArray.length === 3) {
      message
        .react(emojiCharacters[1])
        .then(() => message.react(emojiCharacters[2]))
        .then(() => message.react(emojiCharacters[3]));
    } else if (optionsPoolArray.length === 4) {
      message
        .react(emojiCharacters[1])
        .then(() => message.react(emojiCharacters[2]))
        .then(() => message.react(emojiCharacters[3]))
        .then(() => message.react(emojiCharacters[4]));
    }
  },
};
