# Below taken from https://stackoverflow.com/a/49375740 to help fix import issues

# For relative imports to work in Python 3.6
import os, sys; sys.path.append(os.path.dirname(os.path.realpath(__file__)))