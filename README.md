# mtg-momir-web
マジック：ザ・ギャザリングの対戦フォーマットの1つであるモミール・ベーシックのためのカード抽選Webアプリケーションです。

## 使い方
1. <write url> にアクセスします
2. マナ総量を入力します
3. 「カードを取得」を押すとカード名と画像が表示されます
4. 再度「カードを取得」を押すと表示されていたカードが抽選済みに移動し、新たなカードが表示されます
5. 「リセット」を押すと今まで出たカードが全てリセットされます

### 注意点
- マナ総量を入力せずカードを取得した場合、全てのマナ総量の中から抽選されます
- 同じカードは複数回表示されません。同じカードが抽選された場合には再抽選をしてください
- 表面がクリーチャーであるカードのみ抽選されます

## APIの利用
mtg-momir-webはScryfall APIを利用しています。
https://scryfall.com/docs/api

## Author
- https://github.com/Shade4827
- X: [@shade4827](https://x.com/shade4827)

## ファンコンテンツ・ポリシー
mtg-momir-web is unofficial Fan Content permitted under the Fan Content Policy. Not approved/endorsed by Wizards. Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC.

mtg-momir-webはファンコンテンツ・ポリシーに沿った非公式のファンコンテンツです。ウィザーズ社の認可/許諾は得ていません。題材の一部に、ウィザーズ・オブ・ザ・コースト社の財産を含んでいます。©Wizards of the Coast LLC.

https://company.wizards.com/ja/legal/fancontentpolicy
