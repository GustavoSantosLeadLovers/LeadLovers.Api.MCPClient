#!/usr/bin/env node

/**
 * Automated Branch Cleanup Script
 *
 * Versão totalmente automatizada do script de limpeza de branches.
 * Executa todas as operações sem interação do usuário.
 */

import { execSync } from 'child_process';

// Cores para output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execCommand(command, silent = false) {
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: silent ? 'pipe' : 'inherit' });
    return output?.trim();
  } catch (error) {
    if (!silent) {
      log(`❌ Erro ao executar: ${command}`, 'red');
    }
    return null;
  }
}

async function getCurrentBranch() {
  return execCommand('git branch --show-current', true);
}

async function getMainBranch() {
  try {
    const remoteBranches = execCommand('git branch -r', true);
    if (remoteBranches?.includes('origin/main')) return 'main';
    if (remoteBranches?.includes('origin/master')) return 'master';
    return 'main';
  } catch {
    return 'main';
  }
}

async function getLocalBranches() {
  try {
    const output = execCommand('git branch', true);
    return output
      ?.split('\n')
      .map(branch => branch.replace(/^\*?\s+/, '').trim())
      .filter(branch => branch && !branch.includes('('))
      .filter(branch => branch !== 'main' && branch !== 'master') || [];
  } catch {
    return [];
  }
}

async function getRemoteBranches() {
  try {
    const output = execCommand('git branch -r', true);
    return output
      ?.split('\n')
      .map(branch => branch.replace(/^\s+/, '').replace('origin/', ''))
      .filter(branch => branch && !branch.includes('HEAD') && !branch.includes('->')) || [];
  } catch {
    return [];
  }
}

async function autoCleanupBranches() {
  log(`${colors.bold}🧹 Auto Git Branch Cleanup${colors.reset}`, 'cyan');
  log('═'.repeat(40), 'blue');

  try {
    // 1. Verificar se estamos em um repositório git
    if (!execCommand('git rev-parse --git-dir', true)) {
      log('❌ Não é um repositório git!', 'red');
      return;
    }

    // 2. Obter informações das branches
    const mainBranch = await getMainBranch();
    const currentBranch = await getCurrentBranch();

    log(`📍 Branch principal: ${mainBranch}`, 'blue');
    log(`📍 Branch atual: ${currentBranch}`, 'blue');

    // 3. Verificar se há mudanças não commitadas
    const hasUnstagedChanges = execCommand('git diff --quiet', true) === null;
    const hasStagedChanges = execCommand('git diff --cached --quiet', true) === null;

    if (hasUnstagedChanges || hasStagedChanges) {
      log('\n⚠️ Há mudanças não commitadas!', 'yellow');
      log('Faça commit ou stash das mudanças antes de continuar.', 'yellow');
      return;
    }

    // 4. Mudar para branch principal se necessário
    if (currentBranch !== mainBranch) {
      log(`\n🔄 Mudando para ${mainBranch}...`, 'yellow');
      if (execCommand(`git checkout ${mainBranch}`)) {
        log(`✅ Mudou para ${mainBranch}`, 'green');
      } else {
        log(`❌ Erro ao mudar para ${mainBranch}`, 'red');
        return;
      }
    }

    // 5. Atualizar branch principal
    log('\n⬇️ Atualizando branch principal...', 'yellow');
    execCommand('git fetch origin');
    if (execCommand(`git pull origin ${mainBranch}`)) {
      log('✅ Branch principal atualizada!', 'green');
    } else {
      log('❌ Erro ao atualizar branch principal', 'red');
      return;
    }

    // 6. Limpar referências remotas
    log('\n🔄 Limpando referências remotas...', 'yellow');
    execCommand('git remote prune origin');
    log('✅ Referências remotas atualizadas!', 'green');

    // 7. Obter branches
    const localBranches = await getLocalBranches();
    const remoteBranches = await getRemoteBranches();

    // 8. Identificar branches órfãs
    const branchesToRemove = localBranches.filter(branch =>
      !remoteBranches.includes(branch) && branch !== mainBranch
    );

    if (branchesToRemove.length > 0) {
      log('\n🗑️ Removendo branches órfãs:', 'yellow');

      let removedCount = 0;
      for (const branch of branchesToRemove) {
        if (execCommand(`git branch -D ${branch}`, true)) {
          log(`  ✅ ${branch}`, 'green');
          removedCount++;
        } else {
          log(`  ❌ Erro ao remover: ${branch}`, 'red');
        }
      }

      log(`\n📊 Removidas: ${removedCount}/${branchesToRemove.length} branches`, 'cyan');
    } else {
      log('\n✅ Nenhuma branch órfã encontrada!', 'green');
    }

    // 9. Status final
    const remainingBranches = await getLocalBranches();

    log('\n' + '═'.repeat(40), 'blue');
    log('✅ Limpeza automática concluída!', 'green');
    log(`📍 Branch atual: ${mainBranch}`, 'blue');
    log(`📊 Branches locais restantes: ${remainingBranches.length}`, 'blue');

    if (remainingBranches.length > 0) {
      log('\n📋 Branches locais:', 'blue');
      for (const branch of remainingBranches) {
        const existsRemotely = remoteBranches.includes(branch);
        const status = existsRemotely ? '🟢' : '🟡';
        log(`  ${status} ${branch}`, existsRemotely ? 'green' : 'yellow');
      }
    }

  } catch (error) {
    log(`\n❌ Erro: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Execução
autoCleanupBranches().catch(console.error);