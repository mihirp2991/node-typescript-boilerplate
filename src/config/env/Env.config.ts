export enum ConfigKey {
  NODE_ENV = "NODE_ENV",
  CLIENT_SECRET = "CLIENT_SECRET",
  NODE_PORT = "NODE_PORT",
  MONGO_USERNAME = "MONGO_USERNAME",
  MONGO_PASSWORD = "MONGO_PASSWORD",
  MONGO_CLUSTER = "MONGO_CLUSTER",
  MONGO_APPNAME = "MONGO_APPNAME"
}

type ConfigMap = Map<string, any>;

const config: ConfigMap = new Map<string, any>();

const loadConfig = (): void => {
  Object.keys(process.env).forEach((key) => config.set(key, process.env[key]));
};

const getConfig = <T>(key: ConfigKey): T => {
  return config.get(key);
};

const isProduction = (): boolean => getConfig<string>(ConfigKey.NODE_ENV) === "production";

const isStaging = (): boolean => getConfig<string>(ConfigKey.NODE_ENV) === "staging";

const isDev = (): boolean => !isProduction() && !isStaging();

export const Config = { loadConfig, getConfig, isProduction, isStaging, isDev };
