(function () {
	"use strict";

	function documentSelector(selector) {
		return Array.from(document.querySelectorAll(selector));
	}

	function syncSize(master, slave) {
		slave.style.width = master.clientWidth + "px";
	}

	function getMouseX(parent, e) {
		const bounds = parent.getBoundingClientRect(),
			x = e.clientX - bounds.left;
		return { x, width: bounds.width };
	}

	function initComparer(lhs) {
		const container = lhs.closest(".comparison-container"),
			splitPos = lhs.dataset.comparisonSplitter;
		let dragOffset;

		//Lock the compared element's width to the original width:
		window.addEventListener("load", (e) => syncSize(container, lhs));
		window.addEventListener("resize", (e) => syncSize(container, lhs));
		syncSize(container, lhs);

		//Put the compared element into a resizable wrapper:
		const lhsWrapper = container.appendChild(document.createElement("div"));
		lhsWrapper.classList.add("comparison-lhs-wrapper");
		lhsWrapper.appendChild(lhs);

		const dragger = container.appendChild(document.createElement("div"));
		dragger.classList.add("comparison-dragger");

		if (splitPos) {
			lhsWrapper.style.width = dragger.style.left = splitPos;
		}

		// Dragging magic:
		dragger.onmousedown = (e) => {
			e.preventDefault();
			dragOffset = getMouseX(dragger, e);
			//console.log(lhs, dragOffset)
		};
		container.addEventListener("mousemove", (e) => {
			if (dragOffset) {
				if (e.buttons === 1) {
					e.preventDefault();

					const newX = getMouseX(container, e),
						relX = (newX.x - dragOffset.x) / newX.width;
					lhsWrapper.style.width = dragger.style.left =
						Math.max(0, Math.min(relX, 1)) * 100 + "%";
				} else {
					dragOffset = undefined;
				}
			}
		});
	}

	function init() {
		documentSelector(".comparison-lhs").forEach(initComparer);
		console.log(`adding listener`);
		document.querySelector(`input#file1`).addEventListener(`change`, (e) => {
			console.log(e.target.files);
			const reader = new FileReader();
			reader.onload = (e) => {
				const image = document.querySelector(`#image1`);
				image.src = e.target.result;
			};
			reader.readAsDataURL(e.target.files[0]);
		});
		document.querySelector(`input#file2`).addEventListener(`change`, (e) => {
			console.log(e.target.files);
			const reader = new FileReader();
			reader.onload = (e) => {
				const image = document.querySelector(`#image2`);
				image.src = e.target.result;
			};
			reader.readAsDataURL(e.target.files[0]);
		});
	}

	setTimeout(() => {}, 1000 * 1);

	init();
})();
