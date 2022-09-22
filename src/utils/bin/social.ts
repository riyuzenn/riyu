import config from '../../../config.json';

export const twitter = async (args: string[]): Promise<string> => {
  window.open(`https://www.twitter.com/${config.social.twitter}/`, '_blank');

  return 'Opening twitter...';
};

export const github = async (args: string[]): Promise<string> => {
  window.open(`https://github.com/${config.social.github}/`, '_blank');

  return 'Opening github...';
};

export const discord = async (args: string[]): Promise<string> => {
  window.open(`https://discord.com/users/${config.social.discord}/`, '_blank');

  return 'Opening discord...';
};
