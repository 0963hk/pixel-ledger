import { formatCurrency } from './format';
import { getRecordStreak } from './stats';
import { getCategoryLabel, t } from './i18n';

const posterWidth = 1080;
const posterHeight = 1920;
const palette = {
  bg: '#f4efe2',
  panel: '#fffaf0',
  text: '#24312f',
  soft: '#73827b',
  accent: '#97ad8f',
  accentStrong: '#6e8764',
  gold: '#c9a86a',
  line: '#26312f',
  red: '#b86c63',
};

function drawPixelFrame(context, x, y, width, height, fill = palette.panel) {
  context.fillStyle = fill;
  context.fillRect(x, y, width, height);

  context.fillStyle = palette.line;
  context.fillRect(x, y, width, 8);
  context.fillRect(x, y + height - 8, width, 8);
  context.fillRect(x, y, 8, height);
  context.fillRect(x + width - 8, y, 8, height);
}

function drawTitle(context, title, subtitle) {
  context.fillStyle = palette.text;
  context.font = '36px "Press Start 2P"';
  context.fillText('PIXEL LEDGER', 80, 110);

  context.font = '52px Manrope';
  context.fillText(title, 80, 200);
  context.fillStyle = palette.soft;
  context.font = '28px Manrope';
  context.fillText(subtitle, 80, 250);
}

function drawMetricBlock(context, x, y, label, value, accent = palette.accentStrong) {
  drawPixelFrame(context, x, y, 290, 180);
  context.fillStyle = accent;
  context.fillRect(x + 24, y + 24, 64, 16);
  context.fillStyle = palette.soft;
  context.font = '24px "Press Start 2P"';
  context.fillText(label.toUpperCase().slice(0, 10), x + 24, y + 78);
  context.fillStyle = palette.text;
  context.font = '48px Manrope';
  context.fillText(value, x + 24, y + 138);
}

function drawFooter(context, text) {
  context.fillStyle = palette.soft;
  context.font = '24px Manrope';
  context.fillText(text, 80, posterHeight - 90);
}

function drawBars(context, series, x, y, width, height) {
  drawPixelFrame(context, x, y, width, height);
  const innerX = x + 36;
  const innerY = y + 36;
  const innerWidth = width - 72;
  const innerHeight = height - 90;
  const barWidth = Math.floor(innerWidth / series.length) - 16;
  const max = Math.max(...series.map((item) => item.amount), 1);

  series.forEach((item, index) => {
    const barHeight = Math.max((item.amount / max) * (innerHeight - 30), 10);
    const barX = innerX + index * (barWidth + 16);
    const barY = innerY + innerHeight - barHeight;

    context.fillStyle = palette.accent;
    for (let cursor = 0; cursor < barHeight; cursor += 16) {
      const chunkHeight = Math.min(12, barHeight - cursor);
      context.fillRect(barX, barY + cursor, barWidth, chunkHeight);
    }

    context.fillStyle = palette.text;
    context.font = '20px "Press Start 2P"';
    context.fillText(item.label.slice(0, 2), barX, y + height - 22);
  });
}

function drawCategoryRows(context, rows, x, y, width, height, language, settings) {
  drawPixelFrame(context, x, y, width, height);
  const total = rows.reduce((sum, item) => sum + item.amount, 0) || 1;

  rows.slice(0, 5).forEach((row, index) => {
    const top = y + 48 + index * 86;
    const barWidth = (row.amount / total) * (width - 250);

    context.fillStyle = palette.text;
    context.font = '26px Manrope';
    context.fillText(getCategoryLabel(row.category, language), x + 30, top);

    context.fillStyle = palette.gold;
    context.fillRect(x + 30, top + 20, Math.max(barWidth, 20), 24);

    context.fillStyle = palette.soft;
    context.fillText(formatCurrency(row.amount, settings), x + width - 200, top + 22);
  });
}

function drawBadge(context, x, y, title, value, note) {
  drawPixelFrame(context, x, y, 290, 260);
  context.fillStyle = palette.gold;
  context.fillRect(x + 26, y + 26, 80, 80);
  context.fillStyle = palette.text;
  context.font = '22px "Press Start 2P"';
  context.fillText(title.toUpperCase(), x + 26, y + 150);
  context.font = '60px Manrope';
  context.fillText(String(value), x + 26, y + 220);
  context.fillStyle = palette.soft;
  context.font = '24px Manrope';
  context.fillText(note, x + 26, y + 245);
}

export async function generateShareImage({
  template,
  monthLabel,
  stats,
  monthRecords,
  settings,
}) {
  const language = settings?.language || 'en-US';
  const tt = (key) => t(language, key);

  if (!monthRecords.length) {
    throw new Error(tt('shareNoData'));
  }

  const canvas = document.createElement('canvas');
  canvas.width = posterWidth;
  canvas.height = posterHeight;
  const context = canvas.getContext('2d');

  context.imageSmoothingEnabled = false;
  context.fillStyle = palette.bg;
  context.fillRect(0, 0, posterWidth, posterHeight);

  context.fillStyle = '#e5ddcb';
  for (let x = 0; x < posterWidth; x += 48) {
    for (let y = 0; y < posterHeight; y += 48) {
      context.fillRect(x, y, 4, 4);
    }
  }

  if (template === 'monthly') {
    drawTitle(context, monthLabel, tt('monthlySummaryDesc'));
    drawMetricBlock(context, 80, 320, tt('monthExpenseLabel'), formatCurrency(stats.monthExpense, settings), palette.red);
    drawMetricBlock(context, 395, 320, tt('monthIncomeLabel'), formatCurrency(stats.monthIncome, settings), palette.accentStrong);
    drawMetricBlock(context, 710, 320, tt('balance'), formatCurrency(stats.balance, settings), palette.gold);
    drawCategoryRows(context, stats.categoryBreakdown, 80, 580, 920, 540, language, settings);
    drawPixelFrame(context, 80, 1160, 920, 360);
    context.fillStyle = palette.text;
    context.font = '26px "Press Start 2P"';
    context.fillText(tt('monthlyNotes').toUpperCase().slice(0, 14), 118, 1220);
    context.font = '38px Manrope';
    context.fillText(`${tt('topCategory')}: ${getCategoryLabel(stats.topCategory, language)}`, 118, 1310);
    context.fillText(`${tt('totalRecords')}: ${monthRecords.length}`, 118, 1380);
    context.fillText(tt('shareMonthLine'), 118, 1450);
    drawFooter(context, 'pixel-ledger · minimal finance snapshot');
  }

  if (template === 'weekly') {
    const sevenDayTotal = stats.recentTrend.reduce((sum, item) => sum + item.amount, 0);
    drawTitle(context, tt('weeklyTrend'), tt('weeklyTrendDesc'));
    drawBars(context, stats.recentTrend, 80, 320, 920, 620);
    drawMetricBlock(context, 80, 1000, '7D', formatCurrency(sevenDayTotal, settings), palette.red);
    drawMetricBlock(context, 395, 1000, tt('peakDay'), stats.topDay?.label ?? '--', palette.gold);
    drawPixelFrame(context, 710, 1000, 290, 180);
    context.fillStyle = palette.soft;
    context.font = '22px "Press Start 2P"';
    context.fillText('PEAK AMOUNT', 736, 1074);
    context.fillStyle = palette.text;
    context.font = '42px Manrope';
    context.fillText(formatCurrency(stats.topDay?.amount ?? 0, settings), 736, 1140);
    drawPixelFrame(context, 80, 1240, 920, 280);
    context.fillStyle = palette.text;
    context.font = '28px Manrope';
    context.fillText(tt('shareWeekLine'), 118, 1345);
    context.fillStyle = palette.soft;
    context.fillText(tt('shareWeekSubline'), 118, 1410);
    drawFooter(context, 'weekly trend · pixel bars · 1080x1920');
  }

  if (template === 'category') {
    drawTitle(context, tt('categoryBreakdown'), tt('categoryDesc'));
    drawCategoryRows(context, stats.categoryBreakdown, 80, 320, 920, 660, language, settings);
    drawMetricBlock(context, 80, 1040, tt('totalSpend'), formatCurrency(stats.monthExpense, settings), palette.red);
    drawMetricBlock(context, 395, 1040, 'Top 1', getCategoryLabel(stats.categoryBreakdown[0]?.category ?? 'Other', language), palette.gold);
    drawMetricBlock(context, 710, 1040, 'Top 2', getCategoryLabel(stats.categoryBreakdown[1]?.category ?? 'Other', language), palette.accent);
    drawPixelFrame(context, 80, 1290, 920, 230);
    context.fillStyle = palette.text;
    context.font = '34px Manrope';
    context.fillText(
      `Top 3: ${stats.categoryBreakdown
        .slice(0, 3)
        .map((item) => getCategoryLabel(item.category, language))
        .join(' / ') || 'None'}`,
      118,
      1410,
    );
    drawFooter(context, 'category balance · soft pixel ratio');
  }

  if (template === 'achievement') {
    const streak = getRecordStreak(monthRecords);
    const activeDays = new Set(monthRecords.map((record) => record.date)).size;
    drawTitle(context, tt('achievementBadge'), tt('achievementDesc'));
    drawBadge(context, 80, 340, 'streak', streak, language === 'zh-CN' ? '连续记账' : 'days in a row');
    drawBadge(context, 395, 340, 'days', activeDays, language === 'zh-CN' ? '本月活跃' : 'active this month');
    drawBadge(context, 710, 340, 'logs', monthRecords.length, language === 'zh-CN' ? '本月记录' : 'records this month');
    drawPixelFrame(context, 80, 720, 920, 560);
    context.fillStyle = palette.gold;
    context.fillRect(118, 770, 120, 120);
    context.fillStyle = palette.text;
    context.font = '28px "Press Start 2P"';
    context.fillText(tt('shareAchievementTitle'), 118, 960);
    context.font = '42px Manrope';
    context.fillText(tt('shareAchievementLine1'), 118, 1050);
    context.fillText(tt('shareAchievementLine2'), 118, 1120);
    context.fillStyle = palette.soft;
    context.font = '30px Manrope';
    context.fillText(tt('shareAchievementLine3'), 118, 1190);
    drawFooter(context, 'habit card · shareable poster');
  }

  return canvas.toDataURL('image/png');
}
