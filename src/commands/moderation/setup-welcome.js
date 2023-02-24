const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
const welcomeSchema = require("../../models/welcome");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup-welcome")
    .setDescription("Configurar o canal, mensagem e cargo para novos membros do server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Canal para a mensagem de boas-vindas")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("message").setDescription("Mensagem de boas-vindas").setRequired(true)
    )
    .addRoleOption((option) =>
      option.setName("role").setDescription("Cargo para os novos membros").setRequired(true)
    ),
  async execute(interaction, client) {
    const { channel, options } = interaction;

    const welcomeChannel = options.getChannel("channel");
    const welcomeMessage = options.getString("message");
    const welcomeRole = options.getRole("role");

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.Administrator)) {
      interaction.reply({
        content: "Você não tem permissão para usar este comando!",
        ephemeral: true,
      });
    }

    welcomeSchema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
      if (!data) {
        await welcomeSchema.create({
          Guild: interaction.guild.id,
          Channel: welcomeChannel.id,
          Message: welcomeMessage,
          Role: welcomeRole.id,
        });
      } else {
        const filter = { Guild: interaction.guild.id };
        const updateDoc = {
          $set: {
            Channel: welcomeChannel.id,
            Message: welcomeMessage,
            Role: welcomeRole.id,
          },
        };
        const result = await welcomeSchema.updateOne(filter, updateDoc);
        console.log(
          `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
        );
      }
      await interaction.reply({
        content: `Mensagem de boas-vindas para novos membros criada! \n
      Canal: ${welcomeChannel}\n
      Mensagem: ${welcomeMessage}\n
      Cargo: ${welcomeRole}`,
        ephemeral: true,
      });
    });
  },
};
