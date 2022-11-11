const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Banir um usuário do server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((option) =>
      option.setName("target").setDescription("Usuario a ser banido.").setRequired(true)
    )
    .addStringOption((option) => option.setName("reason").setDescription("Motivo do banimento.")),

  async execute(interaction) {
    const { options } = interaction;

    const user = options.getUser("target");
    const reason = options.getString("reason") || "Nenhum motivo dado.";

    const member = await interaction.guild.members.fetch(user.id);

    const errEmbed = new EmbedBuilder()
      .setDescription(
        `Erro ao banir o ${user.username}! Seu cargo é menor que o dele ou faltam permissões!`
      )
      .setColor(0xc72c3b);

    if (member.roles.highest.position >= interaction.member.roles.highest.position)
      return interaction.reply({ embeds: [errEmbed], ephemeral: true });

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers))
      return interaction.reply({ embeds: [errEmbed], ephemeral: true });

    const succesEmbed = new EmbedBuilder()
      .setTitle("**:white_check_mark: Banido**")
      .setDescription(`Usuário ${user} banido`)
      .addFields(
        { name: "Motivo", value: `${reason}`, inline: true },
        { name: "Duração", value: `${time}`, inline: true },
        { name: "Juíz", value: `${interaction.user}` }
      )
      .setColor(0x5fb041)
      .setTimestamp();

    try {
      await member.ban({ reason });

      await interaction.reply({ embeds: [succesEmbed] });
    } catch (err) {
      console.log(err);
    }
  },
};
