#!/usr/bin/env python3
# This script reads the names of directories in the directory it is run in,
# and writes them to a JSON file located at DATA_FILEPATH.
# This file is then used to populate the entries of a doc version switcher.
import os
import json
from os.path import isdir

# Where the list of versions will be recorded
DATA_FILEPATH = "versions.json"


def main():
    # Get a list of top-level directory names
    directories = [
        filepath for filepath
        in os.listdir(".")
        if isdir(filepath)
    ]

    data_to_write = {
        "versions": directories
    }

    # Write out the list to a file
    with open(DATA_FILEPATH) as f:
        f.write(json.dumps(data_to_write))

    print(f"Wrote doc versions to '{DATA_FILEPATH}:", data_to_write)


if __name__ == '__main__':
    main()
