const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Limpar o número de mensagens de um usuário específico ou de um canal")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Quantidade de mensagens para limpar")
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Selecione um usuário para excluir as mensagens dele")
        .setRequired(false)
    ),

  async execute(interaction) {
    const { channel, options } = interaction;

    const amount = options.getInteger("amount");
    const target = options.getUser("user");

    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages))
      return await interaction.reply({
        content: "Você não tem permissão para usar este comando!",
        ephemeral: true,
      });

    if (!amount)
      return await interaction.reply({
        content: "Você não especificou a quantidade de mensagens!",
        ephemeral: true,
      });

    if (amount > 100 || amount < 1)
      return await interaction.reply({
        content: "Especifique um número de 1 a 100 para excluir",
        ephemeral: true,
      });

    const messages = await channel.messages.fetch({
      limit: amount + 1,
    });

    const resEmbed = new EmbedBuilder().setColor(0x5fb041);

    if (target) {
      let i = 0;
      const filtered = [];

      (await messages).filter((msg) => {
        if (msg.author.id === target.id && amount > i) {
          filtered.push(msg);
          i++;
        }
      });

      await channel.bulkDelete(filtered).then((messages) => {
        resEmbed.setDescription(
          `✅ ${interaction.user} deletou **${messages.size}** mensagens de ${target} neste canal.`
        );
        interaction.reply({ embeds: [resEmbed] });
      });
    } else {
      await channel.bulkDelete(amount, true).then((messages) => {
        resEmbed.setDescription(
          `✅ ${interaction.user} deletou **${messages.size}** mensagens do canal: ${channel}.`
        );
        interaction.reply({ embeds: [resEmbed] });
      });
    }
  },
};
