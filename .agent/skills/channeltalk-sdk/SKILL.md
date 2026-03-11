---
name: channeltalk-sdk
description: 채널톡(Channel.io) JavaScript SDK 설치 및 초기화 가이드
---

# 채널톡(Channel.io) SDK 스킬

이 스킬은 웹 서비스에 채널톡(Channel.io) 채팅 버튼을 설치하고 초기화하는 방법을 안내합니다.

## 1. SDK 로드 및 설치
HTML 파일의 `</body>` 태그 바로 앞에 아래 스크립트를 삽입합니다.

```html
<!-- Channel Plugin Scripts -->
<script>
  (function() {
    var w = window;
    if (w.ChannelIO) {
      return (window.console.error || window.console.log || function(){})('ChannelIO script included twice.');
    }
    var ch = function() {
      ch.c(arguments);
    };
    ch.q = [];
    ch.c = function(args) {
      ch.q.push(args);
    };
    w.ChannelIO = ch;
    function l() {
      if (w.ChannelIOInitialized) {
        return;
      }
      w.ChannelIOInitialized = true;
      var s = document.createElement('script');
      s.type = 'text/javascript';
      s.async = true;
      s.src = 'https://cdn.channel.io/plugin/ch-plugin-web.js';
      s.charset = 'UTF-8';
      var x = document.getElementsByTagName('script')[0];
      if (x.parentNode) {
        x.parentNode.insertBefore(s, x);
      }
    }
    if (document.readyState === 'complete') {
      l();
    } else if (window.attachEvent) {
      window.attachEvent('onload', l);
    } else {
      window.addEventListener('DOMContentLoaded', l, false);
      window.addEventListener('load', l, false);
    }
  })();
</script>
<!-- End Channel Plugin -->
```

## 2. SDK 부트(Boot) 및 초기화
설치 스크립트 아래에 `ChannelIO('boot', ...)` 코드를 추가하여 버튼을 활성화합니다.

```javascript
<script>
  ChannelIO('boot', {
    "pluginKey": "YOUR_PLUGIN_KEY_HERE", // 채널톡 관리자 페이지에서 발급받은 키
    "profile": {
      "name": "고객명", // 선택 사항
      "mobileNumber": "01012345678" // 선택 사항
    }
  });
</script>
```

## 3. 주요 설정 옵션
- `pluginKey`: (필수) 채널톡 고유 플러그인 키
- `memberId`: 멤버 유저 연동 시 사용
- `profile`: 유저의 이름, 이메일, 전화번호 등 추가 정보 전달
- `mobileMessengerMode`: 모바일에서 메신저 표시 방식 (`blob` 또는 `full`)

## 4. 커스텀 버튼 연동
기존 버튼 클릭 시 채팅창을 열고 싶을 때 사용합니다.

```javascript
// 채팅창 열기
ChannelIO('showMessenger');

// 특정 버튼에 연결 예시
document.getElementById('my-chat-button').addEventListener('click', function() {
  ChannelIO('showMessenger');
});
```
