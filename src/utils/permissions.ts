import { GuildMember, PermissionsBitField } from "discord.js";

export function isAdmin(member: GuildMember): boolean {
  if (!member) return false;
  return member.permissions.has(PermissionsBitField.Flags.Administrator);
}

export function isModerator(member: GuildMember): boolean {
  if (!member) return false;
  return isAdmin(member) || member.permissions.has(PermissionsBitField.Flags.ModerateMembers);
}

export function canModerate(moderator: GuildMember, target: GuildMember): boolean {
  if (!isModerator(moderator)) return false;
  if (!target) return false;
  return moderator.roles.highest.position > target.roles.highest.position;
}
