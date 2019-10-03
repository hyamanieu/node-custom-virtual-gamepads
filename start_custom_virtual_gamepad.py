#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Fri Jan 18 08:28:59 2019

@author: hyamanieu
"""
import os
import sys
import subprocess
import signal

DIR_PATH = os.path.dirname(os.path.abspath(__file__))
DEFAULT_SVG = os.path.join(DIR_PATH,'public','images','controler_extracted.svg')

gamepad_html = os.path.join(DIR_PATH,'public','gamepad.html')
gamepad_empty_html = os.path.join(DIR_PATH,'gamepad_empty.html')


def process_inputs(argv):
    assert (len(argv)<3),"0 or 1 argument with the gamepad filename is expected."
    
    if len(argv) == 1:
        return DEFAULT_SVG
    else:
        return argv[1]

def sigterm_detected(thin, thing):
    raise
    
signal.signal(signal.SIGTERM,sigterm_detected)

def set_up_gamepad(fp=DEFAULT_SVG):
    print("Setting up following gamepad: {}".format(fp))
    with open(fp) as f:
        line = f.readline()
        while line:
            pos = f.tell()
            line = f.readline()
            if '<svg' in line:
                break
        f.seek(pos)
        svg = f.read()
        
    one_joystick = '"dirCenter"' in svg
    second_joystick = '"dirCenter2"' in svg
    
    if one_joystick:
        svg = """<div id="dirContainer">
            </div>\n"""+svg
    if one_joystick and second_joystick:
        svg = """<div id="dirContainer2">
            </div>\n"""+svg
    elif second_joystick and not one_joystick:
        raise Exception(('You cannot have the second joystick alone. You need' 
                        ' the first joystick as defined by dirCenter in the svg.'))
    
    with open(gamepad_empty_html) as f:
        html = f.read()
        new_html = html.replace('{{}}',svg)
        
    with open(gamepad_html,'w') as f:
        f.write(new_html)
    
    p = subprocess.Popen(['node','main.js'], cwd=DIR_PATH, preexec_fn=os.setsid,
                         stdout=subprocess.PIPE,
                         close_fds=True)
    print("virtual gamepad running with PID: ",p.pid)
    return p




if __name__ == '__main__':
    fp = process_inputs(sys.argv)
    p = set_up_gamepad(fp)
    p.wait()
    os.killpg(os.getpgid(p.pid), signal.SIGTERM)
