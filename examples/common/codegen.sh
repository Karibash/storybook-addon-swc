#!/bin/bash

SCRIPT_DIR=$(cd $(dirname $0); pwd)
TEMPLATE_DIR="${SCRIPT_DIR}/template"

GENERATED_DIR=$1
GENERATED_COUNT=$2

rm -rf $GENERATED_DIR
mkdir $GENERATED_DIR

for i in `seq 1 $GENERATED_COUNT`
do
    cp -r $TEMPLATE_DIR $GENERATED_DIR/Button$i
    for f in `ls $GENERATED_DIR/Button$i`
     do
       mv $GENERATED_DIR/Button$i/$f $GENERATED_DIR/Button$i/${f/Button/Button$i}
       sed -i.bak -e "s/Button/Button$i/" $GENERATED_DIR/Button$i/${f/Button/Button$i}
       find $GENERATED_DIR/Button$i/*.bak -type f | xargs rm
     done
done
