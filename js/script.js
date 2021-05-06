"use strict";

document.addEventListener("DOMContentLoaded", ready);

function ready() {
  document.addEventListener("scroll", function () {
    let yOffset = window.pageYOffset;
    parallax(yOffset);
  });

  /**
   * Parallax [data-parallax="k"]
   */
  parallax(window.pageYOffset);
  function parallax(yOffset) {
    let parallaxItems = document.querySelectorAll("[data-parallax]");
    let windowHeight = window.innerHeight;
    for (let item of parallaxItems) {
      let itemOffset = item.getBoundingClientRect().y + yOffset;
      if (
        yOffset + windowHeight < itemOffset ||
        yOffset + windowHeight > itemOffset + windowHeight + item.offsetHeight
      )
        continue;

      let targetOffset = yOffset - itemOffset + windowHeight;
      let k = item.dataset.parallax;

      if (itemOffset > windowHeight) {
        item.style.transform = `translateY(${+k * targetOffset}px)`;
      } else {
        item.style.transform = `translateY(${+k * yOffset}px)`;
      }
    }
  }

  /**
   * Header hamburger toggler
   */
  let headerHamburger = document.getElementById("hamburger");
  headerHamburger.onclick = function (e) {
    this.classList.toggle("active");
    this.nextElementSibling.classList.toggle("active");
  };

  /**
   * Modal manager
   *
   * Чтобы открыть нужное окно,
   * используйте openModal([id, title])
   * где:
   * id(обязательный) - это идентификатор
   * модального окна, хранится в атрибуте
   * [data-modal-item]
   *
   * title(необязательный) - это заголовок
   * окна, если не указать, то будет
   * заголовок по умолчанию
   */
  let modal = document.querySelector("[data-modal]");
  let modals = document.querySelectorAll("[data-modal-item]");
  let modalLinks = document.querySelectorAll("[data-modal-open]");
  let modalClose = document.querySelectorAll("[data-modal-close]");
  let modalTitleFields = document.querySelectorAll("[data-modal-title]");
  let modalContainer = document.querySelector("[data-modal-container]");
  let previousModal;
  let currentModal;

  modalContainer.onclick = function (e) {
    if (e.target != this) return;
    e.preventDefault();
    e.stopPropagation();
    if (window.innerWidth > 1024) {
      closeCurrentModal();
    }
  };

  modalLinks.forEach((el) => {
    el.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      openModal(el.dataset.modalOpen.split(", "));
    };
  });

  modalClose.forEach((el) => {
    el.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      closeCurrentModal();
    };
  });

  function closeCurrentModal() {
    document.body.classList.remove("block");
    modal.classList.remove("active");
    currentModal.classList.remove("active");
    currentModal = false;
  }

  function openModal([id, linkTitle]) {
    let targetModal = Object.values(modals).find((item) => {
      return item.dataset.modalItem.split(", ")[0] == id;
    });
    if (!targetModal) return;
    currentModal = targetModal;
    let title = linkTitle || currentModal.dataset.modalItem.split(", ")[1];
    document.body.classList.add("block");
    modal.classList.add("active");
    currentModal.classList.add("active");

    focusModal();
    setModalTitle(title);
  }

  function focusModal() {
    let focusItem = currentModal.querySelector("[data-modal-focus]");
    if (focusItem) {
      focusItem.focus();
    }
  }

  function setModalTitle(title) {
    modalTitleFields.forEach((el) => {
      el.innerText = title;
    });
  }

  /**
   * input file
   */
  let fileInput = document.querySelectorAll(".main-form .file-field input");

  fileInput.forEach((el) => {
    el.onchange = function (e) {
      let fileName = this.value.split("\\").pop();
      if (fileName.length > 15) {
        fileName = fileName.slice(0, 15) + "..." + fileName.split(".").pop();
      }
      this.nextElementSibling.querySelector(".field").innerText = fileName;
    };
  });

  /**
   * mainTable
   */
  let mainTables = document.querySelectorAll(".main-table");
  mainTables.forEach((el) => {
    destributeMainTable(el);
  });

  function destributeMainTable(table) {
    let cellsWidth = table.dataset.columns.split(" ");

    for (let row of table.querySelectorAll(".row")) {
      let cells = row.querySelectorAll(".cell");
      for (let i = 0; i < cellsWidth.length; i++) {
        if (!cells[i]) return;
        cells[i].style.width = cellsWidth[i];
      }
    }
  }

  /**
   * Select input
   */
  let selectListLi = document.querySelectorAll(
    ".select-input .select-list ul.list li"
  );
  selectListLi.forEach((el) => {
    el.onclick = () => {
      let current = el.parentElement.previousElementSibling;
      current.parentElement.blur();
      current.dataset.currentValue = el.dataset.value;
      current.innerHTML = el.innerHTML + '<i class="icon-down down"></i>';
      resetSelectList(el.parentElement);
      el.classList.add("active");
    };
  });

  function resetSelectList(list) {
    list.querySelectorAll("li").forEach((el) => {
      el.classList.remove("active");
    });
  }

  /**
   * Currency progress
   */
  let currencyProgress = document.querySelectorAll("[data-currency-progress]");
  currencyProgress.forEach((el) => {
    el.querySelector(".bg").style.width = el.dataset.currencyProgress + "%";
  });

  /**
   * Toggle tabs
   */
  let toggleTabs = document.querySelectorAll("[data-tab]");
  let toggleTabTogglers = document.querySelectorAll("[data-toggle-tab]");

  toggleTabTogglers.forEach((tab) => {
    tab.onclick = function () {
      let currentTabIndex;
      let currentTogglers = Array.from(toggleTabTogglers).filter((item) => {
        return item.dataset.toggleTab == tab.dataset.toggleTab;
      });
      deactivateArrElements(currentTogglers);
      tab.classList.add("active");
      for (let i = 0; i < currentTogglers.length; i++) {
        if (currentTogglers[i] == tab) {
          currentTabIndex = i;
          break;
        }
      }
      toggleToggleTab(tab.dataset.toggleTab, currentTabIndex);
    };
  });

  function toggleToggleTab(groupName, index) {
    let currentTabs = Array.from(toggleTabs).filter((item) => {
      return item.dataset.tab == groupName;
    });
    deactivateArrElements(currentTabs);
    currentTabs.find((item, i) => i == index).classList.add("active");
  }

  function deactivateArrElements(arr) {
    arr.forEach((el) => {
      el.classList.remove("active");
    });
	}
	
	/**
	 * Operations history (mobile)
	 */
	let opTable = document.querySelector('.operations-history-page .main-table');
	let opBack = document.querySelector('.operations-history-page .back');
	let opRows = document.querySelectorAll('.operations-history-page .main-table__container .row');
	let opMobileAddition = document.querySelector('.operations-history-page__mobile-addition');
	opRows.forEach( el => {
		el.onclick = () => {
			opMobileAddition.innerHTML = el.innerHTML;
			opMobileAddition.classList.add('active');
			opTable.classList.add('hidden');
			opBack.classList.add('active');
		};
  });
  if(opBack) {
    opBack.onclick = () => {
      opMobileAddition.classList.remove('active');
      opTable.classList.remove('hidden');
      opBack.classList.remove('active');
    };
  }
  
  /**
	 * Mobile window
	 */
	let mwToToggle = document.querySelectorAll('[data-mw-to-toggle]');
	let mwTogglers = document.querySelectorAll('[data-mw-toggler]');
  let mwBack = document.querySelector('[data-mw-back]');
  let mwContent = document.querySelector('[data-mw-content]');
  
	mwTogglers.forEach( el => {
		el.onclick = () => {
      if(mwContent) {
        mwContent.innerHTML = el.innerHTML;
      }
			mwToggleActive();
      console.log(mwContent);
    };
  });
  if(mwBack) {
    mwBack.onclick = () => {
      mwToggleActive();
    };
  }
  function mwToggleActive() {
    mwToToggle.forEach( el => {
      el.classList.toggle('active');
    });
  }

}

window.onload = function () {
  /**
   * Animated opening lists
   */
  let listsTogglers = document.querySelectorAll("[data-open-list]");
  let lists = document.querySelectorAll("[data-list]");
  let listHeight = Symbol("height");
  let listId = Symbol("id");

  lists.forEach((el, i) => {
    let [id, status = false] = el.dataset.list.split(" ");
    let height = el.offsetHeight;
    let toggler = Array.from(listsTogglers).find(
      (item) => item.dataset.openList == id
    );
    toggler.classList.add("active");
    if (height <= 0) {
      toggler.classList.remove("active");
    }
    el.style.height = "auto";
    el.style.overflow = "hidden";
    el[listHeight] = el.offsetHeight;
    el[listId] = id;
    el.style.height = height + "px";

    if (status !== "open") el.style.height = 0;
  });

  listsTogglers.forEach((el, i) => {
    el.addEventListener("click", function (e) {
      let id = el.dataset.openList;
      let list = Array.from(lists).find((item) => item[listId] == id);
      let currentHeight = list.offsetHeight;
      let targetHeight = currentHeight ? 0 : list[listHeight];

      this.classList.toggle("active");
      animate({
        duration: 400,
        timing: easeOutCirc,
        draw(process) {
          list.style.height =
            currentHeight + (targetHeight - currentHeight) * process + "px";
        },
      });

      e.preventDefault();
      e.stopPropagation();
    });
  });
};
