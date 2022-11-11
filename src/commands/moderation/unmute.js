const { Client, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Unmute a member from the guild")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Selecione o usuário que você deseja desmutar.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const { guild, options } = interaction;

    const user = options.getUser("target");
    const member = guild.members.cache.get(user.id);

    const errEmbed = new EmbedBuilder()
      .setDescription("Algo deu errado. Tente de novo.")
      .setColor(0xc72c3b);

    const succesEmbed = new EmbedBuilder()
      .setTitle("**:white_check_mark: Desmutado**")
      .setDescription(`Usuário ${user} desmutado.`)
      .setColor(0x5fb041)
      .setTimestamp();

    if (member.roles.highest.position >= interaction.member.roles.highest.position)
      return interaction.reply({ embeds: [errEmbed], ephemeral: true });

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers))
      return interaction.reply({ embeds: [errEmbed], ephemeral: true });

    try {
      await member.timeout(null);

      interaction.reply({ embeds: [succesEmbed] });
    } catch (err) {
      console.log(err);
    }
  },
};
