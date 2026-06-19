export function simpleGitignore(patterns) {
  const ignoreList = [];
  const unignoreList = [];

  patterns.split('\n').forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    
    if (line.startsWith('!')) {
      unignoreList.push(line.substring(1));
    } else {
      ignoreList.push(line);
    }
  });

  return function(filePath) {
    // 简单匹配（处理常见场景）
    for (const unignore of unignoreList) {
      if (filePath.includes(unignore)) return false;
    }

    for (const ignore of ignoreList) {
      // 目录匹配
      if (ignore.endsWith('/')) {
        if (filePath.startsWith(ignore)) return true;
        continue;
      }

      // 通配符匹配
      if (ignore.includes('*')) {
        const regex = new RegExp(
          ignore
            .replace(/\./g, '\\.')
            .replace(/\*\*/g, '.*')
            .replace(/\*/g, '[^/]*')
            .replace(/\?/g, '[^/]')
        );
        if (regex.test(filePath)) return true;
        continue;
      }

      // 精确匹配
      if (filePath.includes(ignore) || filePath.endsWith(ignore)) {
        return true;
      }
    }

    return false;
  };
}