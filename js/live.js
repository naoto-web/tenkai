/* ===========================================================
   live.js — 操作画面（ドック）→ 出力画面（ブラウザソース）の実時間同期

   ねらい：OBSのカスタムブラウザドックと、ブラウザソースの間で
           BroadcastChannel が通るかを実機で確かめること。
           通れば C案（操作をOBS内に常設）が成立する。

   ・?view=output を付けた側が「出力」。付けない側が「操作」
   ・同一オリジンであることが条件（どちらも naoto-web.github.io/tenkai/）
   ・操作側は2秒ごとにpingを打ち、出力側がpongを返す。
     操作側の緑/赤インジケータはこの往復で決まる＝これがC案の可否判定そのもの

   BroadcastChannelが通らなかった場合の代替は obs-websocket の
   BroadcastCustomEvent 経由のリレー。そこはこのファイルを差し替えるだけで済むよう、
   外に見せるのは init / publish / isAlive の3つだけにしてある。
   =========================================================== */

var Live = (function () {

  var CHANNEL = 'tenkai-live-v1';
  var PING_MS = 2000;    // 生存確認の間隔
  var DEAD_MS = 5000;    // これだけpongが来なければ切断とみなす
  var SEND_MS = 33;      // 位置の送信間隔（約30fps。ドラッグはこれで十分滑らか）

  var chan = null;
  var mode = 'control';  // 'control' | 'output'
  var handlers = {};
  var lastPong = 0;
  var lastSend = 0;
  var available = false;

  function now() { return Date.now(); }

  function post(msg) {
    if (!chan) return;
    try { chan.postMessage(msg); } catch (e) {}
  }

  function onMessage(ev) {
    var m = ev.data || {};

    if (mode === 'output') {
      if (m.type === 'ping') { post({ type: 'pong' }); return; }
      if (m.type === 'state' && handlers.onState) handlers.onState(m.data);
      return;
    }

    /* 操作側 */
    if (m.type === 'pong') { lastPong = now(); return; }
    if (m.type === 'hello') {
      /* 出力側が起動した。現状を即座に送って追いつかせる */
      lastPong = now();
      if (handlers.onHello) handlers.onHello();
    }
  }

  return {
    /** @returns {boolean} BroadcastChannel がこの環境で使えるか */
    init: function (viewMode, h) {
      mode = viewMode === 'output' ? 'output' : 'control';
      handlers = h || {};

      try {
        chan = new BroadcastChannel(CHANNEL);
        chan.onmessage = onMessage;
        available = true;
      } catch (e) {
        chan = null;
        available = false;
        return false;
      }

      if (mode === 'output') {
        post({ type: 'hello' });
      } else {
        setInterval(function () { post({ type: 'ping' }); }, PING_MS);
        post({ type: 'ping' });
      }
      return true;
    },

    available: function () { return available; },

    /** 出力側が生きているか（操作側でのみ意味がある） */
    isAlive: function () {
      return available && (now() - lastPong) < DEAD_MS;
    },

    /** 状態を出力側へ流す。ドラッグ中に毎フレーム呼ばれるので間引く */
    publish: function (data, force) {
      if (!chan || mode !== 'control') return;
      var t = now();
      if (!force && t - lastSend < SEND_MS) return;
      lastSend = t;
      post({ type: 'state', data: data });
    }
  };
})();
