class PrimNode {
    constructor(value) {
        this.value = value;
        this.auxNode = null;
    }
}

class AuxNode {
    constructor(primNode) {
        this.primNode = primNode;
        this.fusedNode = null;
    }
}

class FusedNode {
    constructor() {
        this.value = 0;
        this.refCount = 0;
    }

    updateCode(oldValue, newValue) {
        // Update the value of the fused node
        this.value = newValue;
    }
}

class BackupStack {
  constructor() {
    // Initialize linked lists or arrays
    this.auxList = new LinkedList(); // Assuming you have a LinkedList class or use an array here
  }

  insertAtPrimaries(key, data, primLinkedList) {
    if (primLinkedList.contains(key)) {
      // Handle updating existing node in primary
      const old = primLinkedList.get(key).value;
      primLinkedList.update(key, data);
      this.send(key, data, old);
    } else {
      // Create new primNode and auxNode
      const primNode = new PrimNode(data);
      const auxNode = new AuxNode(primNode);
      primLinkedList.insert(key, primNode);
      this.auxList.insertAtEnd(auxNode); // Ensure auxList is initialized
      this.send(key, data, null);
    }
  }

  insertAtBackups(key, newValue, oldValue, auxLinkedList) {
    for (let i = 0; i < auxLinkedList.length; i++) {
      const fusedNode = auxLinkedList[i].contains(key) 
        ? auxLinkedList[i].get(key).fusedNode
        : new FusedNode();
      
      fusedNode.updateCode(oldValue, newValue);
      this.send(key, newValue, oldValue);
    }
  }

  send(key, data, oldData) {
    console.log(`Sending data to backup for key ${key}:`, { data, oldData });
  }
}


// Helper Methods (for managing linked lists, etc.)

class LinkedNode {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
    }

    insertAtEnd(node) {
        if (!this.tail) {
        this.head = this.tail = node;
        } else {
        this.tail.next = node;
        this.tail = node;
        }
    }

    contains(key) {
        let current = this.head;
        while (current) {
        if (current.key === key) return true;
        current = current.next;
        }
        return false;
    }

    get(key) {
        let current = this.head;
        while (current) {
        if (current.key === key) return current;
        current = current.next;
        }
        return null;
    }

    insert(key, node) {
        const newNode = new LinkedNode(key, node);
        this.insertAtEnd(newNode);
    }
    }
  

// export functions to use in other modules
export { PrimNode, AuxNode, FusedNode, BackupStack, LinkedList };
