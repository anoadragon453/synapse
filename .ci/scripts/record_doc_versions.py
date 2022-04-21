#!/usr/bin/env python3
# Copyright 2022 The Matrix.org Foundation C.I.C.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

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
        and not filepath.startswith(".")
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
