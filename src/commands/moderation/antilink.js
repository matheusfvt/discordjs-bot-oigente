const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ChannelType,
} = require("discord.js");
const { QuickDB } = require("quick.db");
const dbAntilink = new QuickDB();
const dbAntilinkSpecific = new QuickDB();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("antilink")
    .setDescription("Ativar ou desativar o sistema de antilink de um canal.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommandGroup((subcommand) =>
      subcommand
        .setName("specific")
        .setDescription("desativar ou ativar links especificos")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("add")
            .setDescription("adicionar links para lista de desativados")
            .addStringOption((option) =>
              option
                .setName("link")
                .setDescription("link ou inicio de link para desativar")
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand.setName("list").setDescription("listar todos os links desativados")
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("delete")
            .setDescription("deletar um link da lista de desativados")
            .addStringOption((option) =>
              option
                .setName("link")
                .setDescription("link que deseja remover da lista")
                .setRequired(true)
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("all")
        .setDescription("desativar todos os links deste canal")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription(
              "canal que deseja desativar | caso não tenha nenhum será no que foi usado o comando"
            )
            .addChannelTypes(ChannelType.GuildText)
        )
    ),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator))
      return await interaction.reply({
        content: "Você não tem permissão para usar este comando!",
        ephemeral: true,
      });

    let embed = new EmbedBuilder();

    const linksDB = await dbAntilinkSpecific.get(
      `links_${interaction.guild.id}.${interaction.channel.id}`
    );

    if (interaction.options.getSubcommand() === "all") {
      const channelOption =
        interaction.options.getChannel("channel") !== null
          ? interaction.options.getChannel("channel").id
          : interaction.channel.id;
      const confirm = await dbAntilink.get(`${channelOption}`);

      if (confirm === null || confirm === false) {
        embed.setColor("Green");
        embed.setDescription(
          `Sistema antilink para **TODOS** os links do canal: ${interaction.channel} \n
          foi \`ativado\` por ${interaction.user}`
        );

        await interaction.reply({
          embeds: [embed],
        });

        await dbAntilink.set(`${channelOption}`, true);
      } else if (confirm === true) {
        embed.setColor("Red");
        embed.setDescription(
          `Sistema antilink para **TODOS** os links do canal: ${interaction.channel} \n
          foi \`desativado\` por ${interaction.user}`
        );

        await interaction.reply({
          embeds: [embed],
        });

        await dbAntilink.set(`${channelOption}`, false);
      }
    } else if (interaction.options.getSubcommand() === "add") {
      const link = interaction.options.getString("link");

      if (linksDB) {
        if (!linksDB.links.link.includes(link)) {
          embed.setColor("Green");
          embed.setDescription(
            `Sistema antilink para **${link}** foi \`ativado\` por ${interaction.user}`
          );
          await dbAntilinkSpecific.push(
            `links_${interaction.guild.id}.${interaction.channel.id}`,
            link
          );
        } else {
          embed.setColor("Blue");
          embed.setDescription(`Este link já existe na lista de links!`);
        }
      } else {
        embed.setColor("Green");
        embed.setDescription(
          `Sistema antilink para **${link}** foi \`ativado\` por ${interaction.user}`
        );
        await dbAntilinkSpecific.push(
          `links_${interaction.guild.id}.${interaction.channel.id}`,
          link
        );
      }

      await interaction.reply({
        embeds: [embed],
      });
    } else if (interaction.options.getSubcommand() === "list") {
      embed.setColor("Blue");

      if (linksDB) {
        embed.setDescription(
          `Links \`desativados\`: \n ${linksDB.length > 1 ? linksDB.join("\r\n") : linksDB}`
        );
      } else {
        embed.setDescription(`Não existe nenhum link desativado!`);
      }

      await interaction.reply({
        embeds: [embed],
      });
    } else if (interaction.options.getSubcommand() === "delete") {
      const link = interaction.options.getString("link");

      if (linksDB) {
        if (linksDB.includes(link)) {
          embed.setColor("Red");
          embed.setDescription(
            `Sistema antilink para **${link}** foi \`desativado\` por ${interaction.user}`
          );
          const index = linksDB.indexOf(link);
          linksDB.splice(index, 1);
          await dbAntilinkSpecific.set(`links_${interaction.guild.id}`, linksDB);
        } else {
          embed.setColor("Blue");
          embed.setDescription(`Não existe este link na lista de links!`);
        }
      } else {
        embed.setColor("Blue");
        embed.setDescription(`Não existe nenhum link na lista!`);
      }

      await interaction.reply({
        embeds: [embed],
      });
    }
  },
};
