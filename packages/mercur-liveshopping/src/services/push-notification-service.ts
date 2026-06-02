import { MedusaService } from "@medusajs/framework/utils"
import SellerPushSubscription from "../models/seller-push-subscription"
import webpush from "web-push"

export default class PushNotificationService extends MedusaService({
    SellerPushSubscription
}) {
    constructor() {
        super(...arguments)
        if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
            webpush.setVapidDetails(
                'mailto:support@mercurjs.com',
                process.env.VAPID_PUBLIC_KEY,
                process.env.VAPID_PRIVATE_KEY
            )
        }
    }

    async subscribe(sellerId: string, customerId: string, subscription: any) {
        return await this.createSellerPushSubscriptions({
            seller_id: sellerId,
            customer_id: customerId,
            subscription
        })
    }

    async notifyFollowers(sellerId: string, title: string, body: string, url: string) {
        const subscriptions = await this.listSellerPushSubscriptions({
            seller_id: sellerId
        })

        const notifications = subscriptions.map(sub => {
            return webpush.sendNotification(sub.subscription as any, JSON.stringify({
                title,
                body,
                url
            })).catch(err => {
                console.error("Push notification failed", err)
                if (err.statusCode === 410 || err.statusCode === 404) {
                    // Subscription expired or no longer valid
                    return this.deleteSellerPushSubscriptions([sub.id])
                }
            })
        })

        await Promise.all(notifications)
    }
}
