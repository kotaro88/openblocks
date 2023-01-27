package com.openblocks.sdk.plugin.common.sql;

import java.util.Map;

import com.openblocks.sdk.plugin.sqlcommand.GuiSqlCommand;
import com.openblocks.sdk.query.QueryExecutionContext;

import lombok.Builder;
import lombok.Getter;

@Getter
public class SqlBasedQueryExecutionContext extends QueryExecutionContext {

    private final String query;
    private final Map<String, Object> requestParams;
    private final boolean disablePreparedStatement;
    private final GuiSqlCommand guiSqlCommand;

    @Builder
    private SqlBasedQueryExecutionContext(String query, Map<String, Object> requestParams, boolean disablePreparedStatement,
            GuiSqlCommand guiSqlCommand) {
        this.query = query;
        this.requestParams = requestParams;
        this.disablePreparedStatement = disablePreparedStatement;
        this.guiSqlCommand = guiSqlCommand;
    }
}
