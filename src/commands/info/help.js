const {
  ComponentType,
  EmbedBuilder,
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");

const { capitalize } = require("../../helpers/capitalize");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Lista de todos os comandos do bot."),
  async execute(interaction) {
    const emojis = {
      info: "📝",
      moderation: "🛠️",
      public: "⚙️",
    };

    const directories = [...new Set(interaction.client.commands.map((cmd) => cmd.folder))];

    const categories = directories.map((dir) => {
      const getCommands = interaction.client.commands
        .filter((cmd) => cmd.folder === dir)
        .map((cmd) => {
          return {
            name: cmd.data.name,
            description: cmd.data.description || "Este comando não tem descrição",
          };
        });

      return {
        directory: capitalize(dir),
        commands: getCommands,
      };
    });

    const embed = new EmbedBuilder().setDescription("Escolha uma categoria de comandos do menu");

    let index = categories.findIndex((e) => e.directory === "Developer");
    categories.splice(index, 1);

    const components = (state) => [
      new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("help-menu")
          .setPlaceholder("Selecione uma categoria")
          .setDisabled(state)
          .addOptions(
            categories.map((cmd) => {
              return {
                label: cmd.directory,
                value: cmd.directory.toLowerCase(),
                description: `Comandos da categoria ${cmd.directory}`,
                emoji: emojis[cmd.directory.toLowerCase() || null],
              };
            })
          )
      ),
    ];

    const initialMessage = await interaction.reply({
      embeds: [embed],
      components: components(false),
    });

    const filter = (interaction) => interaction.user.id === interaction.member.id;

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      componentType: ComponentType.StringSelect,
    });

    collector.on("collect", (interaction) => {
      const [directory] = interaction.values;
      const category = categories.find((x) => x.directory.toLowerCase() === directory);

      const categoryEmbed = new EmbedBuilder()
        .setTitle(`Comandos ${capitalize(directory)}`)
        .setDescription(`Lista de todos os comandos da ${directory}`)
        .addFields(
          category.commands.map((cmd) => {
            return {
              name: `\`${cmd.name}\``,
              value: cmd.description,
              inline: true,
            };
          })
        );

      interaction.update({ embeds: [categoryEmbed] });
    });

    collector.on("end", () => {
      initialMessage.edit({ components: components(true) });
    });
  },
};
