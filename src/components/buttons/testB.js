module.exports = {
  data: {
    name: `test`,
  },
  async execute(interaction, client) {
    await interaction.reply({
      content: `Esse é um botao teste!`,
    });
  },
};
