/*
 *
 * Copyright 2016 Pavel Chernyak <fjfalcon@fjfalcon.ru>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program (please see the "LICENSE.md" file).
 * If not, see <http://www.gnu.org/licenses/gpl.txt>.
 *
 * @author Pavel Chernyak <fjfalcon@fjfalcon.ru>
 */

'use strict';
const mysql = require('mysql');

/**
 * Constructor.
 */
function Renamer(config) {
    var self = this;
    self.config = config;
    console.log("MySQL СamelСase renamer");
    console.log("\tCopyright 2016 Pavel Chernyak <fjfalcon@fjfalcon.ru");
    if (self.config.parameters === undefined)
        console.log("No configuration file found, please ensure config.json exists")
    self.parameters = self.config.parameters;
    self.exclude_tables = self.config.exclude_tables;
    self.dry_run = self.config.dry_run;
}


/**
 * Sets configuration parameters
 * @param {Renamer} self
 * @returns {Renamer} self
 */
Renamer.prototype.boot = function (self) {
    console.log("MySQL СamelСase renamer");
    console.log("\tCopyright 2016 Pavel Chernyak <fjfalcon@fjfalcon.ru");
    if (self.config.parameters === undefined)
        console.log("No configuration file found, please ensure config.json exists")

    if (self.dry_run)
        console.log("This queries you looking for");
    else {
        console.log("We are ready to change your database");
    }
    self.parameters = self.config.parameters;
    self.exclude_tables = self.config.exclude_tables;
    self.dry_run = self.config.dry_run;

    return self;
};

/**
 * Connect to database
 * @param {Renamer} self
 * @returns {Renamer} self
 */
Renamer.prototype.connect = function (self) {
    self.connection = mysql.createConnection(self.parameters);
}

/**
 * Main work goes here
 * @param {Renamer} self
 */
Renamer.prototype.run = function (self) {
    self.connection.query('SHOW TABLES', parseTables);

    /**
     * Callback to parse tables. Errors passed silently
     * @param err
     * @param result
     */
    function parseTables(err, result) {
        if (err)
            throw err;

        var tables = result;
        var list = [];
        for (var i = 0; i < tables.length; i++) {
            var tableName = tables[i]['Tables_in_' + self.parameters.database];

            if (self.exclude_tables.indexOf(tableName) > -1) continue;
            if (!self.dry_run)
                tableName = self.to_underscore(tableName, "_");
            list.push(tableName);
        }

        prepareTables(list);
        list.forEach(parseTable);


        self.connection.end();
    }

    /**
     * Prepare queries to modify table names in db and execute them if dry_run is false
     * @param tables
     */
    function prepareTables(tables) {
        tables.forEach(function (item) {
            if (self.dry_run)
                if (item != self.to_underscore(item, "_"))
                    console.log("ALTER TABLE `" + item + "` RENAME TO `" + self.to_underscore(item, "_") + "`;");
            else (
                    self.connection.query("ALTER TABLE `" + item + "` RENAME TO `" + self.to_underscore(item, "_") + "`;")
                )
        })
    }

    /**
     * Prepare queries to modify every column in table and execute them if dry_run is false
     * @param table
     */
    function parseTable(table) {
        self.connection.query("SHOW COLUMNS FROM `" + table + "`;", function (err, result) {
            if (err)
                console.log("error" + err);
            else {
                //console.log(result);
                var list = [];
                for (var i = 0; i < result.length; i++) {
                    var column = result[i]["Field"];
                    var newColumn = self.to_underscore(column, "_");
                    if (column != newColumn) {
                        list.push({column: column, type: result[i]["Type"], nullable: result[i]["Null"]});
                    }

                }

                if (list.length > 0) {
                    var query = "ALTER TABLE `" + table + "` ";
                    for (var i = 0; i < list.length; i++) {
                        if (i != 0)
                            query += ",";
                        var column = list[i].column;
                        var newColumn = self.to_underscore(column, "_");
                        query += "CHANGE COLUMN `" + column + "` `" + newColumn + "` " + list[i].type;
                        if (list[i].nullable == "YES") {
                            query += " NULL";
                        }
                        else {
                            query += " NOT NULL";
                        }
                    }
                    query += ";"
                    //
                    //console.log(query);

                    if (self.dry_run)
                        console.log(query);
                    else {
                        self.connection.query(query, function (err, result) {
                                if (err) {
                                    console.log(query);
                                    console.log("error" + err.message);

                                }
                                else {
                                    console.log("ok");
                                }
                            }
                        )
                    }
                    ;

                }
            }
        });

    }


}

/**
 * Translate string to underscore with specified separator
 * @param string
 * @param separator
 * @returns {string}
 */
Renamer.prototype.to_underscore = function (string, separator) {
    return string
        .replace(/([a-z\d])([A-Z])/g, '$1' + separator + '$2')
        .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + separator + '$2')
        .toLowerCase();
}

module.exports.Renamer = Renamer;
