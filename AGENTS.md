# 青天见 (Clear Sky View)

紫微斗数 + 西洋占星双模命盘计算。

## 目标平台

| 平台 | 方式 | 产出 |
|------|------|------|
| 🍎 iOS | Capacitor → Xcode | IPA |
| 🤖 Android | Capacitor → Gradle | APK |
| ⌚ 手表 | 窄屏自适应 | 同 APK |
| 👓 眼镜 | 窄FOV+语音 | 同 APK |
| 💍 指环 | 倾斜滚动 | 同 APK |
| 🦯 手杖 | 摇晃翻页 | 同 APK |

## 双模式

- **紫微斗数**: 农历转换→安命宫→十二宫→十四主星→辅星→四化→大限
- **西洋占星**: 儒略日→行星位置→宫位系统→相位→星座定位

## Harness / Loop（助手）

- 遵循根 `/Users/skat/AGENTS.md`：**Harness Engineering** + **Loop Engineering**
- Guide = 本文件；Sensor = 下方验证命令；同类失误第二次须沉淀规则或测试（棘轮）
- 开干前写清 **Done**；每切片过验证环；显式停止（成功 / 上限 / 无进展 / 人审）
- 详解：`docs/HARNESS_ENGINEERING.md`、`docs/LOOP_ENGINEERING.md`

## 验证环 / Done

```bash
npm install
npm test          # 若有
npm run build     # 或 build:web
npx cap sync android   # 若有 android/
# 可选：JAVA_HOME=…/openjdk@17 npm run apk:debug
```

**Done 示例**：测试通过（若有）+ web 产物进 `www/`/`dist/` + `cap sync` 无报错。可选穿戴未做可搁置，不纳入强制 Done。
