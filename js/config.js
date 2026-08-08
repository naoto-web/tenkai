/* ===========================================================
   config.js — 定数（枠色・レイアウト・既定値）
   =========================================================== */

var CONFIG = (function () {

  /* 競輪の選手服の色（競技規則由来の業界標準）
     1白 2黒 3赤 4青 5黄 6緑 7橙 8桃 9紫
     bg = 円の色 / fg = 車番の文字色 / ring = 縁取り */
  var COLORS = {
    1: { name: '白', bg: '#ffffff', fg: '#141414', ring: 'rgba(0,0,0,.55)' },
    2: { name: '黒', bg: '#1c1c1c', fg: '#ffffff', ring: 'rgba(255,255,255,.7)' },
    3: { name: '赤', bg: '#e02b2b', fg: '#ffffff', ring: 'rgba(255,255,255,.7)' },
    4: { name: '青', bg: '#1668cc', fg: '#ffffff', ring: 'rgba(255,255,255,.7)' },
    5: { name: '黄', bg: '#f7df1c', fg: '#141414', ring: 'rgba(0,0,0,.5)' },
    6: { name: '緑', bg: '#12a150', fg: '#ffffff', ring: 'rgba(255,255,255,.7)' },
    7: { name: '橙', bg: '#f5851f', fg: '#141414', ring: 'rgba(0,0,0,.5)' },
    8: { name: '桃', bg: '#f288b4', fg: '#141414', ring: 'rgba(0,0,0,.5)' },
    9: { name: '紫', bg: '#8455c9', fg: '#ffffff', ring: 'rgba(255,255,255,.7)' }
  };

  return {
    COLORS: COLORS,

    MAX_CAR: 9,

    /* アイコン径 / ステージ幅 の比率 */
    ICON_RATIO_MIN: 0.035,
    ICON_RATIO_MAX: 0.140,
    ICON_RATIO_DEFAULT: 0.076,

    /* ステージ内でアイコン中心が動ける範囲（正規化座標）
       maxY はインフィールドに落ちない位置で止める */
    BOUNDS: { minX: 0.03, maxX: 0.97, minY: 0.12, maxY: 0.72 },

    /* 自動配置のパラメータ */
    LAYOUT: {
      headX: 0.91,      // 先頭の x（進行方向 right のとき）。ライン帯の端が枠で切れない位置
      tailX: 0.05,      // 最後方の下限 x
      gapInLine: 0.076, // 同一ライン内の間隔
      gapBetween: 0.055,// ライン間の追加間隔
      /* ライン番号ごとの縦位置。
         走行ライン（外帯線〜内圏線の間）に寄せて、ラインごとに軽く段違いにする。
         段差を大きくすると「隊列」ではなく「4段の行列」に見えてしまう */
      lineY: [0.63, 0.57, 0.51, 0.66, 0.60, 0.54]
    },

    /** アイコン径(px)。基準はステージ幅だが、16:9より横長になったときは
        高さ基準に切り替える。そうしないと横長画面でアイコンだけ巨大になる。
        main.js と bars.js が同じ値を使う必要があるのでここに置く */
    iconPx: function (w, h, ratio) {
      return Math.min(w, h * 16 / 9) * ratio;
    },

    STORAGE_KEY: 'keirin-tenkai-board-v1',

    /* 出走表・並び予想の取得先。
       OKL配信システム（stagekit）のGASバックエンドをそのまま読ませてもらっている。
       読み取り専用（action=timetable / action=narabi）。空文字にすればレース選択UIごと無効になる。 */
    GAS_URL: 'https://script.google.com/macros/s/AKfycbw7I6ejxz4sy4RMXxc_2mhSxjzHaBrXwExv33_znFRvVfPjVsQSlVsJbh_fcnJ4lNkDVA/exec'
  };
})();
