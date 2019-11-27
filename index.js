#!/usr/bin/env node

const inquirer = require('inquirer');
const CLI = require('clui');
const git = require('simple-git/promise');
const chalk = require('chalk');
const shell = require('shelljs');
const figlet = require('figlet');
const exec = require('child_process').exec;
const Spinner = CLI.Spinner;

const repos = {
  'cust-nxtim': 'next-starter',
  'cust-gtbcum': 'gatsby-ip',
  'cust-crac': 'react-starter'
};

const askQuestions = () => {
  const questions = [
    {
      name: 'DIRECTORY',
      type: 'input',
      message: 'What is the name of the root directory?'
    },
    {
      type: 'list',
      name: 'REPO',
      message: 'What repo do you want?',
      choices: [
        {name: 'Next.js Custom', value: 'cust-nxtim'},
        {name: 'CRA Custom', value: 'cust-crac'},
        {name: 'Gatsby Custom', value: 'cust-gtbcum'},
        {name: 'Next.js w/ SC', value: 'nxtsc'},
        {name: 'Gatsby Starter w/ SC', value: 'gatsbysc'},
        {name: 'CRA', value: 'cra'}
      ]
    }
  ];
  return inquirer.prompt(questions);
};

const clone = async (repo, dir) => {
  const repoPath = `git@github.com:isaac-martin/${repos[repo]}.git`;
  const status = new Spinner('Cloning Starter');
  status.start();
  return git()
    .clone(repoPath, dir)
    .then(() => status.stop())
    .then(() => console.log(chalk.green('Repo cloned')))
    .catch(err => console.error('failed: ', err));
};

const cleanUp = async dir => {
  process.chdir(dir);
  shell.rm('-rf', '.git');
};

const insallStarter = async (repo, dir) => {
  const starters = {
    nxtsc: `npx create-next-app --example with-styled-components ${dir}`,
    gatsbysc: `gatsby new ${dir} https://github.com/blakenoll/gatsby-starter-styled-components`,
    cra: `npx create-react-app ${dir}`
  };

  const starter = starters[repo];

  var starterProcess = exec(starter);

  starterProcess.stdout.pipe(process.stdout);
};

const install = async () => {
  var yarn = exec('yarn install');

  yarn.stdout.pipe(process.stdout);
};

const run = async () => {
  // ask questions
  const answers = await askQuestions();
  const {DIRECTORY, REPO} = answers;

  if (REPO.includes('cust')) {
    await clone(REPO, DIRECTORY);
    await cleanUp(DIRECTORY);
    await install(DIRECTORY);
  } else {
    await insallStarter(REPO, DIRECTORY);
  }
};

run();
