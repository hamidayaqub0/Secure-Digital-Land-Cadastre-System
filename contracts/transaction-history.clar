;; Transaction History Contract
;; Tracks all changes in property ownership

;; Define data structures
(define-map transactions
  { transaction-id: uint }
  {
    property-id: uint,
    from-owner: principal,
    to-owner: principal,
    transaction-type: (string-utf8 20),
    transaction-date: uint,
    details: (string-utf8 500)
  }
)

(define-map property-transactions
  { property-id: uint }
  { transaction-ids: (list 100 uint) }
)

(define-data-var next-transaction-id uint u1)

;; Record a property transaction
(define-public (record-transaction
                (property-id uint)
                (from-owner principal)
                (to-owner principal)
                (transaction-type (string-utf8 20))
                (details (string-utf8 500)))
  (let
    (
      (transaction-id (var-get next-transaction-id))
      (property-txs (default-to { transaction-ids: (list) }
                    (map-get? property-transactions { property-id: property-id })))
    )
    ;; Only allow the property contract to call this
    (asserts! (is-eq tx-sender contract-caller) (err u403))

    ;; Insert the transaction record
    (map-insert transactions
      { transaction-id: transaction-id }
      {
        property-id: property-id,
        from-owner: from-owner,
        to-owner: to-owner,
        transaction-type: transaction-type,
        transaction-date: block-height,
        details: details
      }
    )

    ;; Update the property's transaction list
    (map-set property-transactions
      { property-id: property-id }
      { transaction-ids: (unwrap-panic (as-max-len?
                                        (append (get transaction-ids property-txs) transaction-id)
                                        u100)) }
    )

    ;; Increment the transaction ID counter
    (var-set next-transaction-id (+ transaction-id u1))
    (ok transaction-id)
  )
)

;; Get transaction details
(define-read-only (get-transaction (transaction-id uint))
  (map-get? transactions { transaction-id: transaction-id })
)

;; Get all transactions for a property
(define-read-only (get-property-transactions (property-id uint))
  (map-get? property-transactions { property-id: property-id })
)

;; Get transaction count
(define-read-only (get-transaction-count)
  (- (var-get next-transaction-id) u1)
)
