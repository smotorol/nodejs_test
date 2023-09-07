function requestPay(e, req) 
{
    const make_merchant_uid = () => {
        const current_time = new Date();
        const year = current_time.getFullYear().toString();
        const month = (current_time.getMonth()+1).toString();
        const day = current_time.getDate().toString();
        const hour = current_time.getHours().toString();
        const minute = current_time.getMinutes().toString();
        const second = current_time.getSeconds().toString();
        const merchant_uid = 'MIHEE' + year + month + day + hour + minute + second;
        return merchant_uid;
    };
    const merchant_uid = make_merchant_uid();

    IMP.request_pay(
        {
            pg: CID,
            pay_method: "card",
            merchant_uid: merchant_uid,
            name: "당근 10kg",
            amount: 1004,
            buyer_email: "Iamport@chai.finance",
            buyer_name: "포트원 기술지원팀",
            buyer_tel: "010-1234-5678",
            buyer_addr: "서울특별시 강남구 삼성동",
            buyer_postcode: "123-456",
            m_redirect_url: ReqHostUrlSuccess
        },
        function (rsp) 
        {
            // callback
            //rsp.imp_uid 값으로 결제 단건조회 API를 호출하여 결제결과를 판단합니다.

            // if(rsp.success === true)
            // {
            //     m_redirect_url: ReqHostUrl + '/checkout/success';
            // }
            // else
            // {
            //     m_redirect_url: ReqHostUrl + '/checkout/cancel';
            // }

            if (rsp.success) {
                // 결제 성공 시: 결제 승인 또는 가상계좌 발급에 성공한 경우
                // jQuery로 HTTP 요청
                
                fetch(ReqHostUrlSuccess, {
                    method: 'POST',
                    body: JSON.stringify({
                        imp_uid: rsp.imp_uid,            // 결제 고유번호
                        merchant_uid: rsp.merchant_uid   // 주문번호
                    }),
                    headers: {
                        'X-CSRF-Token': csrf_requestPay,
                        'Content-Type': 'application/json'
                    }
                })
                .then(result => {
                    var TargetUrl = ReqHostUrl + '/orders';
                    window.location.href = TargetUrl;

                    alert("결제에 성공하였습니다");
                })
                .catch(err => console.log(err + rsp.error_msg))
              } 
              else 
              {

                fetch(ReqHostUrlCancel, {
                            method: 'POST',
                            body: JSON.stringify({
                                imp_uid: rsp.imp_uid,            // 결제 고유번호
                                merchant_uid: rsp.merchant_uid   // 주문번호
                            }),
                            headers: {
                                'X-CSRF-Token': csrf_requestPay,
                                'Content-Type': 'application/json'
                            }
                        })
                        .catch(err => console.log(err));

                alert("결제에 실패하였습니다. 에러 내용: " + rsp.error_msg);
              }
            
        }
    );
}