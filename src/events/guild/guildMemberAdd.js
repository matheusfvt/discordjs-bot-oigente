const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildMemberAdd",
  async execute(member) {
    const { guild } = member;
    const welcomeChannel = member.guild.channels.cache.get("1031650206867017879");
    const memberRole = "1040547581840859166";

    const welcomeEmbed = new EmbedBuilder()
      .setTitle("**Novo membro!**")
      .setDescription(`Bem-vindo <@${member.id}> ao server!`)
      .setColor(0x037821)
      .setThumbnail(
        `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.jpeg`
      )
      .addFields({ name: "Total de membros", value: `${guild.memberCount}` })
      .setTimestamp();

    welcomeChannel.send({ embeds: [welcomeEmbed] });
    member.roles.add(memberRole);
  },
};
