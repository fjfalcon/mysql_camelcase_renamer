<h3>mysql_camelcase_renamer</h3>

<p>This app created to transfer CamelCase table and CamelCase columns of mysql database to underscore.</p>

<h3>SYSTEM REQUIREMENTS</h3>

Node.js 5.x.x

<h3>USAGE</h3>

<b>1.</b> Download package.
<b>2.</b> Edit config.json file with your database settings.
  &nbsp;&nbsp;
   <b>Remark</b>:
config.json contains brief description of each configuration parameter
<b>3.</b> Go to package directory,install dependencies, and run the app.
<pre>$ cd ~/mysql_camelcase_renamer</pre>
<pre>$ npm install</pre>
<pre>$ node main.js</pre>


<h3>LICENSE</h3>

NMIG is available under "GNU GENERAL PUBLIC LICENSE" (v. 3)
http://www.gnu.org/licenses/gpl.txt.


  &nbsp;&nbsp;
  
<h3>Remarks</h3>
This is my first application on node.js.

I created it to convert my mysql database to camelcase so postgresql can normaly work with hibernate. To convert database to postgresql i used [NMIG](https://github.com/AnatolyUss/nmig) tool.
