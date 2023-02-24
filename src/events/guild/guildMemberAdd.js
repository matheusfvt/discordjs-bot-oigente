const { EmbedBuilder } = require("discord.js");
const Schema = require("../../models/welcome");

module.exports = {
  name: "guildMemberAdd",
  async execute(member) {
    Schema.findOne({ Guild: member.guild.id }, async (err, data) => {
      if (!data) return;

      const { guild } = member;
      const welcomeChannel = member.guild.channels.cache.get(data.Channel);

      const welcomeEmbed = new EmbedBuilder()
        .setTitle("**Novo membro!**")
        .setDescription(`${data.Message} ${member.user}`)
        .setColor(0x037821)
        .setThumbnail(
          `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.jpeg`
        )
        .addFields({ name: "Total de membros", value: `${guild.memberCount}` })
        .setTimestamp();

      welcomeChannel.send({ embeds: [welcomeEmbed] });
      member.roles.add(data.Role);
    });
  },
};
