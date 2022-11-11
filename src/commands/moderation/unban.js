const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Desbanir um usuário do server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption((option) =>
      option
        .setName("userid")
        .setDescription("Discord ID do usuário que você deseja desbanir.")
        .setRequired(true)
    ),

  async execute(interaction) {
    const { options } = interaction;

    const userId = options.getString("userid");

    try {
      await interaction.guild.members.unban(userId);

      const embed = new EmbedBuilder()
        .setDescription(`Usuário de ID: ${userId} desbanido do servidor.`)
        .setColor(0x5fb041)
        .setTimestamp();

      await interaction.reply({
        embeds: [embed],
      });
    } catch (err) {
      console.log(err);

      const errEmbed = new EmbedBuilder()
        .setDescription(`Porfavor selecione um ID de usuário válido.`)
        .setColor(0xc72c3b);

      interaction.reply({ embeds: [errEmbed], ephemeral: true });
    }
  },
};
