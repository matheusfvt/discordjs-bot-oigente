const {
  SlashCommandBuilder,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("enquete")
    .setDescription(`Cria uma enquete`)
    .addIntegerOption((option) =>
      option
        .setName("quantidade")
        .setDescription("Quantidade de opções de quer para a enquete | min = 2 |max = 4")
        .setMaxValue(4)
        .setMinValue(2)
        .setRequired(false)
    ),

  async execute(interaction) {
    const numberOfRows = parseInt(interaction.options.getInteger("quantidade"));
    const actionRowArray = [];

    const modal = new ModalBuilder().setCustomId("modalPool").setTitle("Enquete");

    const titleInput = new TextInputBuilder()
      .setCustomId("modalTitlePool")
      .setLabel("Título da enquete")
      .setMaxLength(100)
      .setMinLength(3)
      .setPlaceholder("Digite o título da enquete!")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const titleRow = new ActionRowBuilder().addComponents(titleInput);
    actionRowArray.push(titleRow);

    for (var i = 0; i < numberOfRows; i++) {
      actionRowArray.push(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId(`option${i}`)
            .setLabel(`Opção ${i + 1}`)
            .setMaxLength(15)
            .setMinLength(1)
            .setPlaceholder(`Digite aqui a ${i + 1}º opção`)
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        )
      );
    }

    for (var i = 0; i < actionRowArray.length; i++) {
      modal.addComponents(actionRowArray[i]);
    }

    await interaction.showModal(modal);
  },
};
