module.exports = {
  name: "interactionCreate",

  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const { commands } = client;
      const { commandName } = interaction;

      const command = commands.get(commandName);

      if (!command)
        return interaction.reply({
          content: `No command matching ${interaction.commandName} was found.`,
          ephemeral: true,
        });

      if (command.developer && interaction.user.id !== "231616820568784907")
        return interaction.reply({
          content: "This command is only avaiable for the developer",
          ephemeral: true,
        });

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(`Error executing ${interaction.commandName}`);
        console.error(error);

        await interaction.reply({
          content: "Something went wrong while executing this command...",
          ephemeral: true,
        });
      }
    } else if (interaction.isButton()) {
      const { buttons } = client;
      const { customId } = interaction;

      const button = buttons.get(customId);

      if (!button) return new Error("There is no code for this button!");

      try {
        await button.execute(interaction, client);
      } catch (err) {
        console.log(err);
      }
    } else if (interaction.isModalSubmit()) {
      const { modals } = client;
      const { customId } = interaction;

      const modal = modals.get(customId);

      if (!modal) return new Error("There is no code for this modal!");

      try {
        await modal.execute(interaction, client);
      } catch (error) {
        console.log(error);
      }
    }
  },
};
