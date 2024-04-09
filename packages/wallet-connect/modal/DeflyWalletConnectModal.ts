import {
	DEFLY_WALLET_CONNECT_MODAL_ID,
	DEFLY_WALLET_MODAL_CLASSNAME,
	removeModalWrapperFromDOM,
} from './deflyWalletConnectModalUtils';
import styles from './_defly-wallet-modal.scss?inline';

const deflyWalletConnectModal = document.createElement('template');
const deflyWalletConnectModalClassNames = `${DEFLY_WALLET_MODAL_CLASSNAME} ${DEFLY_WALLET_MODAL_CLASSNAME}--desktop`;

export class DeflyWalletConnectModal extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });

		if (this.shadowRoot) {
			const styleSheet = document.createElement('style');

			styleSheet.textContent = styles;

			{
				deflyWalletConnectModal.innerHTML = `
          <div class="${deflyWalletConnectModalClassNames}">
            <div class="defly-wallet-modal__body">
              <defly-wallet-modal-header modal-id="${DEFLY_WALLET_CONNECT_MODAL_ID}"></defly-wallet-modal-header/>
        
              <defly-wallet-modal-desktop-mode id="defly-wallet-modal-desktop-mode" uri="${this.getAttribute('uri')}">
              </defly-wallet-modal-desktop-mode>
            </div>
          </div>
        `;

				this.shadowRoot.append(deflyWalletConnectModal.content.cloneNode(true), styleSheet);

				this.shadowRoot.addEventListener('click', () => {
					removeModalWrapperFromDOM(DEFLY_WALLET_CONNECT_MODAL_ID);
				});
			}
		}
	}
}
