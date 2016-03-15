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
const fs = require('fs');
const Renamer = require('./renamer')

fs.readFile(__dirname + '/config.json', (error, data) => {
    if (error) {
        console.log('\n\t--Cannot run renamer script\nCannot read configuration info from ' + __dirname + '/config.json');
    } else {
        try {
            let config = JSON.parse(data.toString());
            let renamer = new Renamer.Renamer(config);
            renamer.connect(renamer)
            renamer.run(renamer);

        } catch
            (err) {
            console.log(err + err.stack);
            console.log('\n\t--Cannot parse JSON from' + __dirname + '/config.json');
        }
    }
})
;