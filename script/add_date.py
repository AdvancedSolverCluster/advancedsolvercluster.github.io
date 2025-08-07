import os
import time
import argparse

def get_all_markdown_files(root: str):
    for dirpath, dirnames, filenames in os.walk(root):
        for filename in filenames:
            if filename.endswith('.md'):
                yield os.path.join(dirpath, filename)

def get_last_modified_date(filename: str):
    # format the mtime as December %d, %Y
    # mtime = os.path.getmtime(filename)
    # use git to get time
    # date=$(git log -1 --format="%ad" --date=format:"%Y-%m-%d" -- "$file")
    date = os.popen(f'git log -1 --format="%ad" --date=format:"%Y-%m-%d" -- "{filename}"').read().strip()
    return time.strftime('%B %d, %Y', time.strptime(date, '%Y-%m-%d'))


def process(filename: str):

    # read the file into lines
    with open(filename, 'r') as f:
        lines = f.readlines()

    # find if a row starts with `*Last modified:`
    matched = -1
    for i, line in enumerate(lines):
        if line.startswith('*Last modified:'):
            matched = i
            break

    if matched > -1:
        # update the line
        lines[matched] = f'\n*Last modified: {get_last_modified_date(filename)}*\n'
    else:
        # find the first line that starts with `# `
        matched2 = -1
        for i, line in enumerate(lines):
            if line.startswith('# '):
                matched2 = i
                break
        if matched2 > -1:
            # insert after the matched2 line
            lines.insert(matched2 + 1, f'\n*Last modified: {get_last_modified_date(filename)}*\n')

    # write the file back
    with open(filename, 'w') as f:
        f.writelines(lines)

def main():

    # parse the arguments
    parser = argparse.ArgumentParser()
    parser.add_argument('root', help='The root directory to search for markdown files')
    args = parser.parse_args()

    # get all markdown files
    for filename in get_all_markdown_files(args.root):
        process(filename)

if __name__ == "__main__":
    main()
