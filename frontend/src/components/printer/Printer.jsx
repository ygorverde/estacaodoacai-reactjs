import React, { Component } from 'react'

const initialState = {
    neighborhood: { id: '', name: '', price: '' },
    list: []
}

export default class Printer extends Component {

    state = { ...initialState }

    PrintElement(DivID) {
        var disp_setting = "toolbar=yes,location=no,";
        disp_setting += "directories=yes,menubar=yes,";
        disp_setting += "scrollbars=yes,width=650, height=600, left=100, top=25";
        var content_vlue = document.getElementById(DivID).innerHTML;
        var docprint = window.open("", "", disp_setting);
        // var docprint = window.open('redit2.html')
        docprint.document.open();
        docprint.focus();
        docprint.document.write('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"');
        docprint.document.write('<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">');
        docprint.document.write('<style type="text/css">body{ margin:0px; background-color: #E6E6FA');
        docprint.document.write('font-family:verdana,Arial;color:#000;');
        docprint.document.write('font-family:Verdana, Geneva, sans-serif; font-size:12px;}');
        docprint.document.write('a{color:#000;text-decoration:none;} </style>');
        docprint.document.write('</head><body onLoad="self.print()"><center>');
        docprint.document.write('<h1>ESTAÇÃO DO AÇAÍ</h1>')
        docprint.document.write(content_vlue);  
        docprint.document.write('</center></body></html>');
        docprint.document.close();
        return console.log('PRINTOU')
    }

}