# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - link "Back" [ref=e7] [cursor=pointer]:
          - /url: /
          - button "Back" [ref=e8]:
            - img
            - text: Back
        - generic [ref=e9]:
          - heading "Vault Ordinals" [level=1] [ref=e10]
          - paragraph [ref=e11]: Deposit your Bitcoin Ordinals and mint fractional shares
      - button "Connect Xverse Wallet" [ref=e13]:
        - img
        - text: Connect Xverse Wallet
    - main [ref=e14]:
      - generic [ref=e15]:
        - tablist [ref=e16]:
          - tab "My Ordinals" [selected] [ref=e17]
          - tab "Vaulted" [ref=e18]
          - tab "History" [ref=e19]
        - tabpanel "My Ordinals" [ref=e20]:
          - generic [ref=e23]:
            - heading "Error Loading Ordinals" [level=3] [ref=e24]
            - paragraph [ref=e25]: Xverse wallet is not available. Please install the Xverse extension.
            - button "Try Again" [ref=e26]
  - alert [ref=e27]
```