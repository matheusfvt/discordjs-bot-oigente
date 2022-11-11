const { Client, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Mute a member from the guild.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) =>
      option.setName("target").setDescription("Selecione um usuário para mutar.").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("time").setDescription("Quanto deve durar o mute?").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Qual o motivo para o mute?")
    ),

  async execute(interaction) {
    const { guild, options } = interaction;

    const user = options.getUser("target");
    const member = guild.members.cache.get(user.id);
    const time = options.getString("time");
    const convertedTime = ms(time);
    const reason = options.getString("reason") || "Nenhum motivo dado.";

    const errEmbed = new EmbedBuilder()
      .setDescription("Algo deu errado. Tente de novo.")
      .setColor(0xc72c3b);

    const succesEmbed = new EmbedBuilder()
      .setTitle("**:white_check_mark: Mutado**")
      .setDescription(`Usuário ${user} mutado.`)
      .addFields(
        { name: "Motivo", value: `${reason}`, inline: true },
        { name: "Duração", value: `${time}`, inline: true }
      )
      .setColor(0x5fb041)
      .setTimestamp();

    if (member.roles.highest.position >= interaction.member.roles.highest.position)
      return interaction.reply({ embeds: [errEmbed], ephemeral: true });

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers))
      return interaction.reply({ embeds: [errEmbed], ephemeral: true });

    if (!convertedTime) return interaction.reply({ embeds: [errEmbed], ephemeral: true });

    try {
      await member.timeout(convertedTime, reason);

      interaction.reply({ embeds: [succesEmbed] });
    } catch (err) {
      console.log(err);
    }
  },
};
