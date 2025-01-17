import { JSQuery } from "../comps/queries/jsQuery";
import { SQLQuery } from "../comps/queries/sqlQuery/SQLQuery";
import { HttpQuery } from "../comps/queries/httpQuery/httpQuery";
import { MongoQuery } from "../comps/queries/mongoQuery";
import { OpenBlocksQuery } from "../comps/queries/openBlocksQuery";
import { RedisQuery } from "../comps/queries/redisQuery";
import { EsQuery } from "../comps/queries/esQuery";
import { SMTPQuery } from "../comps/queries/smtpQuery";
import { LibraryQuery } from "../comps/queries/libraryQuery";
import { ViewQuery } from "../comps/queries/viewQuery";
import { GoogleSheetsQuery } from "../comps/queries/googleSheetsQuery";
import { GraphqlQuery } from "../comps/queries/httpQuery/graphqlQuery";
import { toPluginQuery } from "comps/queries/pluginQuery/pluginQuery";
import { MultiCompConstructor } from "openblocks-core";

export type DatasourceType =
  | `plugin:${string}`
  | "mysql"
  | "mongodb"
  | "restApi"
  | "postgres"
  | "openblocksApi"
  | "redis"
  | "es"
  | "mssql"
  | "smtp"
  | "oracle"
  | "clickHouse"
  | "googleSheets"
  | "graphql";

export type ResourceType = DatasourceType | "js" | "libraryQuery" | "view";

const QueryMap = {
  js: JSQuery,
  mysql: SQLQuery,
  restApi: HttpQuery,
  mongodb: MongoQuery,
  postgres: SQLQuery,
  openblocksApi: OpenBlocksQuery,
  redis: RedisQuery,
  es: EsQuery,
  mssql: SQLQuery,
  smtp: SMTPQuery,
  oracle: SQLQuery,
  clickHouse: SQLQuery,
  libraryQuery: LibraryQuery,
  view: ViewQuery,
  googleSheets: GoogleSheetsQuery,
  graphql: GraphqlQuery,
};

export function registryDataSourcePlugin(name: string, dataSourcePlugin: any, target = QueryMap) {
  const type = name as `plugin:${string}`;
  (target as Record<DatasourceType, MultiCompConstructor>)[type] = toPluginQuery(
    dataSourcePlugin.queryConfig
  ) as MultiCompConstructor;
}

export { QueryMap };

// Initialized as write mode, need to switch to the manually executed query when creating a new query or switching data sources
export const manualTriggerResource: ResourceType[] = ["js", "smtp"];

export const QUERY_EXECUTION_OK = "OK";
export const QUERY_EXECUTION_ERROR = "QUERY_EXECUTION_ERROR";
