/**
 * Copyright 2021 Appsmith Inc.
 * <p>
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * <p>
 */

// copied and adapted for datasource meta structure

package com.openblocks.sdk.models;

import java.lang.reflect.Type;
import java.util.List;
import java.util.Map;

import javax.annotation.Nonnull;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.google.gson.InstanceCreator;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class DatasourceStructure {

    private List<Table> tables;

    public DatasourceStructure(List<Table> tables) {
        this.tables = tables;
    }

    public enum TableType {
        TABLE,
        VIEW,
        ALIAS,
        COLLECTION,
    }

    @Data
    @AllArgsConstructor
    public static class Table {
        private TableType type;
        private String schema;
        private String name;
        private List<Column> columns;
        private List<Key> keys;
        @JsonIgnore
        List<Template> templates;

        public void addColumn(Column column) {
            this.columns.add(column);
        }

        public void addKey(Key key) {
            this.keys.add(key);
        }
    }

    @Data
    @AllArgsConstructor
    public static class Column implements Comparable<Column> {
        private String name;
        private String type;
        private String defaultValue;
        private Boolean isAutogenerated;

        @Override
        public int compareTo(@Nonnull Column other) {
            if (other.getName() == null) {
                return 1;
            }

            return name.compareTo(other.getName());
        }
    }

    public interface Key extends Comparable<Key> {
        String getType();

        @Override
        default int compareTo(@Nonnull Key other) {
            if (this instanceof PrimaryKey && other instanceof ForeignKey) {
                return -1;
            }
            if (this instanceof ForeignKey && other instanceof PrimaryKey) {
                return 1;
            }
            if (this instanceof final PrimaryKey thisKey && other instanceof final PrimaryKey otherKey) {
                if (thisKey.getName() != null && otherKey.getName() != null) {
                    return thisKey.getName().compareTo(otherKey.getName());
                }
                if (thisKey.getName() == null) {
                    return 1;
                }
                return -1;
            }

            return 0;
        }
    }

    @Data
    @AllArgsConstructor
    public static class PrimaryKey implements Key {
        private String name;
        private List<String> columnNames;

        public String getType() {
            return "primary key";
        }
    }

    @Data
    @AllArgsConstructor
    public static class ForeignKey implements Key {
        private String name;
        private List<String> fromColumns;
        private List<String> toColumns;

        public String getType() {
            return "foreign key";
        }

    }

    @Data
    @NoArgsConstructor
    public static class Template {
        private String title;
        private String body;
        private Object configuration;

        // To create templates for plugins which store the configurations
        // in List<Property> format

        public Template(String title, String body, List<Property> configuration) {
            this.title = title;
            this.body = body;
            this.configuration = configuration;
        }
        // To create templates for plugins with UQI framework whic store the configurations
        // as a map

        public Template(String title, String body, Map<String, ?> configuration) {
            this.title = title;
            this.body = body;
            this.configuration = configuration;
        }

        // Creating templates without configuration
        public Template(String title, String body) {
            this.title = title;
            this.body = body;
        }

    }

    /**
     * Instance creator is required while de-serialising using Gson as key instance can't be invoked with
     * no-args constructor
     */
    public static class KeyInstanceCreator implements InstanceCreator<Key> {
        @Override
        public Key createInstance(Type type) {
            return () -> null;
        }
    }

}
